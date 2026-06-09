export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a className="footer__brand" href="#top">
          <img src="/logo.png" alt="" width={40} height={40} />
          <span>FUNCLUB</span>
        </a>
        <p className="footer__note">
          Сообщество по вселенной SCP. Не аффилировано с SCP Foundation и разработчиками игр.
        </p>
        <p className="footer__copy">© {new Date().getFullYear()} FUNCLUB</p>
      </div>
    </footer>
  )
}
