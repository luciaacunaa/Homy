import React, { useState, useEffect } from 'react';

function Reviews({ user }) {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('homy_reviews');
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    localStorage.setItem('homy_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = () => {
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña.');
      return;
    }
    if (!text.trim()) return;

    const newReview = {
      id: Date.now(),
      author: user.name || user.email || 'Usuario',
      userId: user.id || null,
      text: text.trim(),
      rating: Number(rating),
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
    setText('');
    setRating(5);
  };

  const removeReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem', background: '#fffaf0', borderRadius: 12 }}>
      <h3 style={{ marginTop: 0, color: '#48601c' }}>Deja tu opinión sobre Homy</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select value={rating} onChange={e => setRating(e.target.value)} style={{ padding: 8 }}>
          {[5,4,3,2,1].map(n => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </select>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={user ? 'Escribe tu reseña aquí...' : 'Inicia sesión para escribir una reseña'}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button onClick={addReview} style={{ background: '#48601c', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Enviar</button>
      </div>

      <div>
        {reviews.length === 0 ? (
          <p style={{ margin: 0 }}>Aún no hay reseñas. Sé el primero en escribir una.</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} style={{ padding: 12, borderRadius: 8, background: '#fff', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#333' }}>{r.author}</strong>
                  <div style={{ color: '#888', fontSize: 12 }}>{new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ color: '#f5a623' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  {(user && ((user.email === 'adminhomy@gmail.com') || user.id === r.userId)) && (
                    <button onClick={() => removeReview(r.id)} style={{ background: 'transparent', border: 'none', color: '#d00', cursor: 'pointer' }}>Eliminar</button>
                  )}
                </div>
              </div>
              <p style={{ marginTop: 8, marginBottom: 0 }}>{r.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reviews;
