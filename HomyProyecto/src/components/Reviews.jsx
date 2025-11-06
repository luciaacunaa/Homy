import React, { useState, useEffect } from 'react';

function Reviews({ user }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error cargando reseñas:', err));
  }, []);

  const addReview = async () => {
    if (!user) return alert('Debes iniciar sesión para dejar una reseña.');
    if (!text.trim()) return;

    const newReview = {
      customers_name: user.name || 'Usuario',
      customers_email: user.email || null,
      rating: Number(rating),
      comment: text.trim(),
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      const textRes = await res.text();
      let jsonRes = null;
      try { jsonRes = JSON.parse(textRes); } catch(e){ /* no JSON */ }

      if (!res.ok) {
        const serverMessage = (jsonRes && (jsonRes.error || jsonRes.message)) || textRes || res.statusText;
        console.error('Error al enviar reseña:', serverMessage);
        return alert('No se pudo guardar la reseña: ' + serverMessage);
      }

      // éxito
      console.log('✅ reseña guardada', jsonRes);
      setText('');
      setRating(5);

      // recargar lista con manejo de error
      try {
        const updated = await fetch('http://127.0.0.1:5000/api/reviews');
        if (updated.ok) {
          setReviews(await updated.json());
        } else {
          console.warn('No se pudo recargar reseñas, status:', updated.status);
        }
      } catch (e) {
        console.warn('Error al recargar reseñas:', e);
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar la reseña. Revisa la consola para más detalles.');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem', background: '#fffaf0', borderRadius: 12 }}>
      <h3 style={{ marginTop: 0, color: '#48601c' }}>Deja tu opinión sobre Homy</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select value={rating} onChange={e => setRating(e.target.value)} style={{ padding: 8 }}>
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </select>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={user ? 'Escribe tu reseña aquí...' : 'Inicia sesión para escribir una reseña'}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button
          onClick={addReview}
          style={{ background: '#48601c', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
        >
          Enviar
        </button>
      </div>

      {reviews.length === 0 ? (
        <p>No hay reseñas aún. Sé el primero en opinar.</p>
      ) : (
        reviews.map(r => (
          <div key={r.review_id} style={{ padding: 12, borderRadius: 8, background: '#fff', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <strong>{r.customers_name}</strong> – <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            <div style={{ color: '#666', fontSize: 12 }}>{new Date(r.created_at).toLocaleString()}</div>
            <p>{r.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;
