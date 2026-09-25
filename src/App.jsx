import { useState } from 'react'
import { menuCategories, restaurant } from './data/menu'
import './App.css'

const icon = (name) => <span className={`icon icon-${name}`} aria-hidden="true" />

function SocialIcon({ name }) {
  if (name === 'Instagram') return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="social-dot" /></svg>
  if (name === 'Facebook') return <svg className="social-icon social-facebook" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H8.3v3H11v8h3Z" /></svg>
  return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.4 4.1c.3 1.8 1.3 2.9 3 3.1v3a8 8 0 0 1-3-.9v5.8a4.8 4.8 0 1 1-4.8-4.8c.3 0 .7 0 1 .1v3.1a1.8 1.8 0 1 0 .8 1.6V4.1h3Z" /></svg>
}

function Product({ product, featured = false }) {
  const [name, pricing] = product
  const isSized = typeof pricing === 'object'

  return (
    <article className={`product ${featured ? 'product-featured' : ''}`}>
      <div className="product-mark">{name.charAt(0)}</div>
      <div className="product-info">
        <h3>{name}</h3>
        {isSized ? <div className="sizes">{Object.entries(pricing).map(([size, price]) => <div className="size" key={size}><span>{size}</span><strong>{price}</strong></div>)}</div> : <strong className="price">{pricing}</strong>}
      </div>
    </article>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState('tacos')

  return (
    <main>
      <header className="hero" id="top">
        <nav className="topbar"><a className="brand-lockup" href="#top"><img className="brand-logo" src="/images/logo_restaurant.png" alt="Logo Pizzaria Beb Lhouma" /><span className="wordmark">PBL<span>.</span></span></a><a className="call-link" href="tel:+21658855100">Appeler {icon('arrow')}</a></nav>
        <div className="hero-content">
          <div className="hero-copy"><p className="kicker">Pizza · Tacos · Sandwich</p><h1>Pizzaria<br /><em>Beb Lhouma</em></h1><p className="hero-text">Le goût du quartier, servi chaud et sans détour.</p><div className="hero-actions"><a className="button button-primary" href="#menu">Voir le menu {icon('arrow')}</a><a className="button button-ghost" href={restaurant.mapsUrl || '#contact'}>{icon('pin')} Nous trouver</a></div></div>
          <div className="hero-art" aria-label="Identite visuelle Pizzaria Beb Lhouma"><div className="sun">PIZZA<br /><span>MADE<br />LOCAL</span></div><div className="stamp">BEB<br />LHOUMA</div><div className="art-line" /></div>
        </div>
        <div className="hero-meta"><span>Menu digital officiel</span><span>Ouvert pour les faims</span></div>
      </header>

      <section className="menu-section" id="menu">
        <div className="section-heading"><p className="kicker">A la carte</p><h2>Choisis ton<br /><em>envie.</em></h2><p>Des recettes généreuses, des prix clairs. Fais défiler les catégories et trouve ton classique.</p></div>
        <nav className="category-nav" aria-label="Categories du menu">{menuCategories.map((category) => <a className={activeCategory === category.id ? 'active' : ''} href={`#${category.id}`} key={category.id} onClick={() => setActiveCategory(category.id)}>{category.name}</a>)}</nav>
        <div className="menu-list">{menuCategories.map((category, categoryIndex) => <section className="menu-category" id={category.id} key={category.id}><div className="category-title"><div><span className="category-number">0{categoryIndex + 1}</span><p className="kicker">{category.eyebrow}</p><h2>{category.name}</h2></div><div className="category-visual" style={{ backgroundImage: `url(${category.image})` }} role="img" aria-label={`Illustration ${category.name}`} /></div><div className="products-grid">{category.products.map((product, index) => <Product key={product[0]} product={product} featured={category.id === 'pizza' && index === 0} />)}</div></section>)}</div>
      </section>

      <section className="social-section" aria-labelledby="social-title"><div className="social-heading"><p className="kicker">La famille Beb Lhouma</p><h2 id="social-title">Reste dans<br /><em>le mouvement.</em></h2></div><div className="social-grid">{Object.entries(restaurant.socials).map(([name, url]) => <a className="social-card" href={url} target="_blank" rel="noreferrer" key={name}><span className="social-card-icon"><SocialIcon name={name} /></span><span><small>Retrouve-nous sur</small><strong>{name}</strong></span>{icon('arrow')}</a>)}</div></section>
      <section className="contact-section" id="contact"><div><p className="kicker">On se retrouve ?</p><h2>Une envie de<br /><em>pizza chaude.</em></h2></div><div className="contact-panel"><p>Pour une question, une adresse ou simplement dire bonjour.</p><div className="phone-list">{restaurant.phones.map((phone) => <a href={`tel:+216${phone.replaceAll(' ', '')}`} key={phone}>{phone} {icon('arrow')}</a>)}</div><a className="location-link" href={restaurant.mapsUrl || '#contact'}>{icon('pin')} Voir la localisation</a></div></section>
      <footer><div className="footer-brand"><span className="wordmark">PBL<span>.</span></span><p>Pizzaria Beb Lhouma</p></div><p className="copyright">Hamza ATAOUI · 2026</p></footer>
    </main>
  )
}

export default App
