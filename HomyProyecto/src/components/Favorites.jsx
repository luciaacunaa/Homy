import React, { useEffect, useState } from 'react';

function Favorites({ onRemove }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('homy_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('homy_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Listen to changes in localStorage from other tabs/components
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'homy_favorites') {
        const val = e.newValue;
        setFavorites(val ? JSON.parse(val) : []);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const remove = (id) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
    if (onRemove) onRemove(id);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto' }}>
      <h2 style={{ color: '#48601c' }}>Tus Favoritos</h2>
      {favorites.length === 0 ? (
        <p>No tienes productos favoritos aún.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {favorites.map(p => (
            <div key={p.id} style={{ padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <img src={p.image_url} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
              <h4 style={{ margin: '0.5rem 0' }}>{p.name || p.products_name}</h4>
              <p style={{ margin: 0 }}><strong>Precio:</strong> ${p.price}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <button onClick={() => remove(p.id)} style={{ background: ' #48601c', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: 6 }}>Quitar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
