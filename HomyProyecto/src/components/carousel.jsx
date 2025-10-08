import React from "react";
import { Carousel } from "react-responsive-carousel";

const MyCarousel = ({ images }) => (
  <div style={{ maxWidth: "100%", width: "100%", margin: "0 auto" }}>
    <Carousel
      showThumbs={false}
      autoPlay
      infiniteLoop
      style={{ width: "100%" }}
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            style={{ left: 15, zIndex: 2, position: "absolute", top: "50%" }}
          >
            ‹
          </button>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            style={{ right: 15, zIndex: 2, position: "absolute", top: "50%" }}
          >
            ›
          </button>
        )
      }
    >
      {images.map((src, idx) => (
        <div key={idx}>
          <img
            src={src}
            alt={`promo-${idx}`}
            style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }}
          />
        </div>
      ))}
    </Carousel>
  </div>
);

export default MyCarousel;
