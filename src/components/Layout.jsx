import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, FileText, User, Home, FolderOpen, Moon, Sun, HelpCircle, Bell } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isDark, setIsDark] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Toggle tema
  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Simular notificações
  const notifications = [
    { id: 1, text: "Seu currículo foi visualizado 5 vezes hoje", time: "2min", unread: true },
    { id: 2, text: "Novo template disponível: Executivo Premium", time: "1h", unread: true },
    { id: 3, text: "Currículo salvo com sucesso", time: "3h", unread: false }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {user && (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CurrículoPro
                  </span>
                </Link>
              </div>
              
              {/* Navigation Menu */}
              <div className="hidden md:flex items-center space-x-6">
                <nav className="flex items-center space-x-2">
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      location.pathname === '/' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Início</span>
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      location.pathname === '/dashboard' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">Meus Currículos</span>
                  </Link>
                </nav>
                
                {/* User Actions */}
                <div className="flex items-center space-x-3">
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                    title={isDark ? 'Modo Claro' : 'Modo Escuro'}
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                      title="Notificações"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Dropdown de Notificações */}
                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Notificações</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div key={notification.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white">{notification.text}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                          <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
                            Ver todas as notificações
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Help Button */}
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                    title="Ajuda"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>

                  {/* User Menu */}
                  <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-gray-500">Usuário Pro</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                      title="Sair"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Help Panel */}
      {showHelp && (
        <div className="fixed bottom-24 right-8 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40 animate-in slide-in-from-bottom-5">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">💬 Como posso ajudar?</h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Como criar um currículo?</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Passo a passo completo</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Qual template escolher?</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Dicas por área profissional</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Como baixar em PDF?</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tutorial de exportação</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/create-resume"
          className="group w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          title="Criar Novo Currículo"
        >
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
      
      <main className={user ? 'pt-8' : ''}>
        {children}
      </main>
    </div>
  )
}