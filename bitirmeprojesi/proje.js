(function () {
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  loadCSS('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  loadCSS('https://fonts.googleapis.com/icon?family=Material+Icons');

  const loadScript = (src, callback) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  };

  loadScript('https://code.jquery.com/jquery-3.7.1.min.js', () => {
    const PRODUCTS_URL = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
    const LOCAL_STORAGE_PRODUCTS_KEY = 'carousel_products';
    const LOCAL_STORAGE_FAVORITES_KEY = 'carousel_favorites';

    if (!window.location.pathname.includes('index.html')) {
      console.log('wrong page');
      return;
    }

    const createStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        html, body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
          background: #fff;
        }
        *::before, *::after {
          box-sizing: inherit;
        }
        .carousel-wrapper {
          position:relative;
          margin: 10px auto;
          max-width: 1250px;
          border-radius: 6px;
          background: #fff;
          overflow: hidden;
          border-top-left-radius: 35px;
          border-top-right-radius: 35px;
        }
        .header {
          background-color: #fff0e1;
          padding: 20px;
          border-top-left-radius: 35px;
          border-top-right-radius: 35px;
          margin-bottom: 20px;
        }
        .carousel-title {
          margin: 0;
          font-size: 25px;
          color: #f7941d;
          font-weight: 550;
          margin-left: 40px;
        }
        .carousel-container {
          overflow: hidden;
          width: 100%;
          height : 100%;          
          cursor: pointer;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .carousel-track {
          display: flex;
          gap: 24px;
          transition: transform 0.3s ease-in-out;
          will-change: transform;          
          scroll-behavior: smooth;
        }
        .carousel-product {
          overflow-x: hidden;
          flex: 0 0 calc(20% - 20px);
          background: #fff;
          border-radius: 16px;
          border: 2px solid #eee; 
          outline: none;
          padding: 16px;
          position: relative;
          display: flex;
          min-height: 60vh;
          max-width:195px;
          flex-direction: column;
          align-items: center;
          padding-bottom: 80px;
          scroll-snap-align: start;
        }
        .carousel-product::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 4px solid #f7941d;
          border-radius: 16px;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }

        .carousel-product:hover::after {
          opacity: 1;
        }
        .carousel-product img {
          height: 180px;
          object-fit: contain;
          width: 100%;
        }
        .brand-name {
          font-size: 12px;
          font-weight: 500;
          color: #6f6f6f;
          margin-top: 60px;
          margin-bottom: 6px;
        }
        .price-row {
          position: absolute;
          bottom: 130px;
          left: 15px;
          right: 15px;
          height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
        }
        .discount-line {
          bottom: 50px;
          display: flex;
          align-items: center;
          gap: 18px;
          min-height: 20px;
        }
        .old-price {
          font-size: 15px;
          color: #999;
          text-decoration: line-through;
        }
        .discount-badge {
          font-size: 20px;
          font-weight: 500;
          color: #00963C;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          
        }
        .discount-badge .arrow-container {
          background-color: #00963C;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(
            50% 0%,     
            80% 10%,   
            100% 35%,   
            95% 65%,    
            75% 90%,    
            50% 100%,   
            25% 90%,    
            5% 65%,    
            0% 35%,     
            20% 10%     
          );
        }
        .discount-badge .arrow-container .material-icons {
          color: #fff;
          font-size: 20px;
        }
        .current-price {
          font-size: 20px;
          font-weight: 600;
          color: #00963C;
        }
        .button {
          position: absolute;
          bottom: 15px;
          left: 15px;
          right: 15px;
          background-color: #fff5ec;
          color: #f7941d;
          border: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;              
          font-size: 13px;                
          border-radius: 999px;
          letter-spacing: 0.25px;            
          padding: 12px 0;
          cursor: pointer;
          transition: background 0.3s;
        }
        .button:hover {
          background-color: #f7941d;
          color: #fff5ec;
        }
        .heart {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        }
          .heart:hover{
          border: 2px solid #f7941d;
        }
        .heart .material-icons {
          font-size: 24px;
          color: #f7941d;
        }
        .heart.filled {
          background-color: #f7941d;
          border-color: #f7941d;
        }
        .heart.filled .material-icons {
          color: #fff;
        }
        .carousel-outer-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 100%;
          margin: 30px auto;
          gap: 0px;
          position: relative;
          min-height: 400px;
        }


        .scroll-button {
          position: absolute;
          top: 50%;               
          transform: translateY(-50%); 
          background: #fff7ed;
          border: 2px solid transparent;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
          color: #f7941d;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .scroll-button:hover {
          background: #fff;
          border-color: #f7941d;
        }
        .scroll-prev {
          left: 70px;
        }

        .scroll-next {
          right: 70px;
        }

        @media (max-width: 1200px) {
          .carousel-product {
            flex: 0 0 calc(20% - 20px); 
          }

        @media (max-width: 1200px) {
            .carousel-product {
              flex: 0 0 calc(25% - 20px); 
            }
          }

        @media (max-width: 992px) {
            .carousel-product {
              flex: 0 0 calc(33.3333% - 20px); 
            }
          }

        @media (max-width: 768px) {
            .carousel-product {
              flex: 0 0 calc(50% - 20px); 
            }

            .scroll-button {
              display: none !important; 
            }
          }


        @media (max-width: 480px) {
            .carousel-product {
              flex: 0 0 100%;
              max-width: 100%;
              padding: 12px;
            }

            .carousel-track {
              gap: 12px;
            }

            .carousel-container {
              padding: 0 8px;
            }
          }
        
      `;
      document.head.appendChild(style);
    };

    const fetchProducts = async () => {
      const local = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (local) return JSON.parse(local);
      const res = await fetch(PRODUCTS_URL);
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(data));
      return data;
    };

    const renderCarousel = (products) => {
      const wrapper = $('<div class="carousel-wrapper"></div>');
      const header = $('<div class="header"><h2 class="carousel-title">Beğenebileceğinizi Düşündüklerimiz</h2></div>');
      const container = $('<div class="carousel-container"></div>');
      const track = $('<div class="carousel-track"></div>');

      let favorites = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY) || '[]');

      products.forEach(product => {
        const item = $('<div class="carousel-product"></div>');
        const heart = $('<div class="heart"><span class="material-icons">' + (favorites.includes(product.id) ? 'favorite' : 'favorite_border') + '</span></div>');
        if (favorites.includes(product.id)) heart.addClass('filled');
        heart.on('click', () => {
          if (favorites.includes(product.id)) {
            favorites = favorites.filter(id => id !== product.id);
            heart.removeClass('filled').html('<span class="material-icons">favorite_border</span>');
          } else {
            favorites.push(product.id);
            heart.addClass('filled').html('<span class="material-icons">favorite</span>');
          }
          localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
        });

        const img = $('<img>').attr('src', product.img || 'https://placehold.co/180x180?text=No+Image').attr('alt', product.name).css('cursor', 'pointer');
        img.on('click', () => window.open(product.url, '_blank'));
        const brandName = $('<div class="brand-name"><strong>' + product.brand + '</strong> - ' + product.name + '</div>');
        const priceRow = $('<div class="price-row"></div>');
        if (product.original_price && product.original_price !== product.price) {
          const discountLine = $('<div class="discount-line"></div>');
          const oldPrice = $('<span class="old-price">' + product.original_price + ' TL</span>');
          const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
          const badge = $('<span class="discount-badge">%' + discount + '<span class="arrow-container"><span class="material-icons">arrow_downward</span></span></span>');
          const newPrice = $('<div class="current-price">' + product.price + ' TL</div>');
          discountLine.append(oldPrice, badge);
          priceRow.append(discountLine, newPrice);
        } else {
          priceRow.append('<div class="current-price" style="color:#6f6f6f;font-weight:600;">' + product.price + ' TL</div>');
        }
        const button = $('<button class="button">Sepete Ekle</button>');
        item.append(heart, img, brandName, priceRow, button);
        track.append(item);
      });

      container.append(track);
      wrapper.append(header, container);
      const outerWrapper = $('<div class="carousel-outer-wrapper"></div>');
      const scrollBtnLeft = $('<button class="scroll-button scroll-prev"><span class="material-icons" style="font-size: 36px; font-variation-settings: \'wght\' 600;">chevron_left</span></button>');
      const scrollBtnRight = $('<button class="scroll-button scroll-next"><span class="material-icons" style="font-size: 36px; font-variation-settings: \'wght\' 600;">chevron_right</span></button>');
      const itemWidth = () => {
        const $item = $('.carousel-product').first();
        return $item.outerWidth(true);
      };     
      scrollBtnLeft.on('click', () => {
        const container = $('.carousel-container').get(0);
        container.scrollBy({
          left: -itemWidth(),
          behavior: 'smooth'
        });
      });
      
      scrollBtnRight.on('click', () => {
        const container = $('.carousel-container').get(0);
        container.scrollBy({
          left: itemWidth(),
          behavior: 'smooth'
        });
      });
      outerWrapper.append(scrollBtnLeft, wrapper, scrollBtnRight); 
      $('body').append(outerWrapper);
    };
    createStyles();
    fetchProducts().then(renderCarousel);
  });
})();