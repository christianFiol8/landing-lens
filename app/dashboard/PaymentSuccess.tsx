'use client'

import { useSearchParams , useRouter   } from 'next/navigation'
import { useEffect , useState } from 'react'

export default function PaymentSuccess(){
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    if (searchParams.get('payment') === 'success') {
      setVisible(true)
      // Limpiar el parámetro de la URL sin recargar la página
      router.replace('/dashboard')
      // Ocultar el banner después de 5 segundos
      const timer = setTimeout(() => setVisible(false), 6000)
      return () => clearTimeout(timer)
    }
  },[searchParams,router])

  if (!visible) return null

  return(
    <div className="border-b" style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}>
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#10B981' }}>
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#065F46' }}>
            ¡Pago exitoso! Ya puedes analizar tu landing page.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-green-400 hover:text-green-600 transition-colors ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  )

}