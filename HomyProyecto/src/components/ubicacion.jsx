
// Componente de ubicación con Google Maps (Obelisco)
export default function UbicacionMapa() {
	return (
		<div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 450 }}>
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26272.14483612634!2d-58.41765108916014!3d-34.6037037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1ses-419!2sar!4v1760618536658!5m2!1ses-419!2sar"
				width="600"
				height="450"
				style={{ border: 0 }}
				allowFullScreen=""
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				title="Ubicación Obelisco"
			></iframe>
		</div>
	);
}