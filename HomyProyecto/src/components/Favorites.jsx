import React, { useEffect, useState } from 'react';

function Favorites({ onRemove, user, onLoginClick }) {
  const makeKey = (u) => {
    if (!u) return null;
    return `homy_favorites_${u.customers_email || u.email || u.customers_id || u.id}`;
  };
  const favKey = makeKey(user);

  const [favorites, setFavorites] = useState(() => {
    if (!favKey) return [];
    const saved = localStorage.getItem(favKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (favKey) {
      localStorage.setItem(favKey, JSON.stringify(favorites));
    }
  }, [favorites, favKey]);

  // Listen to changes in localStorage from other tabs/components
  useEffect(() => {
    const handler = (e) => {
      if (!favKey) return;
      if (e.key === favKey) {
        const val = e.newValue;
        setFavorites(val ? JSON.parse(val) : []);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [favKey]);

  const remove = (id) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
    if (onRemove) onRemove(id);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 800, margin: '2rem auto', textAlign: 'center' }}>
        <h2 style={{ color: '#48601c' }}>Tus Favoritos</h2>
        <p>Debes ingresar para ver y guardar favoritos.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button onClick={() => onLoginClick && onLoginClick()} style={{ background: '#48601c', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}>Ingresar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto' }}>
      <h2 style={{ color: '#48601c' }}>Tus Favoritos</h2>
      {favorites.length === 0 ? (
        <p>No tienes productos favoritos aan.</p>
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
