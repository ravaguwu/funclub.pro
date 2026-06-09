import { useToast } from '../lib/useToast'
import type { GameServer } from '../data/servers'

export function ConnectButton({ server, color }: { server: GameServer; color: string }) {
  const toast = useToast()

  if (server.placeholder) {
    return (
      <span className="connect connect--soon" aria-disabled="true">
        {server.label}
      </span>
    )
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(server.ip)
      toast(`IP скопирован: ${server.ip}`)
    } catch {
      // фолбэк для старых браузеров / без https
      const ta = document.createElement('textarea')
      ta.value = server.ip
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        toast(`IP скопирован: ${server.ip}`)
      } catch {
        toast(`IP: ${server.ip}`)
      }
      document.body.removeChild(ta)
    }
  }

  return (
    <button
      className="connect"
      onClick={copy}
      style={{ '--mc': color } as React.CSSProperties}
      title={`Скопировать ${server.ip}`}
    >
      <span className="connect__label">{server.label}</span>
      <span className="connect__ip">{server.ip}</span>
      <span className="connect__copy" aria-hidden="true">⧉</span>
    </button>
  )
}
