(function() {
  'use strict';

  // Configuration
  const KITTIE_ORIGIN = window.location.origin; // Use current origin for local development
  const EMBED_VERSION = '1.0.0';

  // Global KittieEmbed object
  window.KittieEmbed = {
    version: EMBED_VERSION,
    
    // Open kit in modal
    open: function(kitId, options = {}) {
      const modal = createModal(kitId, options);
      document.body.appendChild(modal);
      showModal(modal);
    },

    // Load kit inline
    load: function(kitId, containerId, options = {}) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('KittieEmbed: Container not found:', containerId);
        return;
      }
      
      loadKitContent(kitId, container, options);
    }
  };

  // Create modal overlay
  function createModal(kitId, options) {
    const modal = document.createElement('div');
    modal.className = 'kittie-modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'kittie-modal-content';
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      width: 100%;
      overflow: hidden;
      position: relative;
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 18px;
      color: #666;
      z-index: 10001;
    `;
    closeButton.onclick = () => hideModal(modal);

    const iframe = document.createElement('iframe');
    iframe.src = `${KITTIE_ORIGIN}/embed-kit/${kitId}`;
    iframe.style.cssText = `
      width: 100%;
      height: 80vh;
      border: none;
    `;

    modalContent.appendChild(closeButton);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);

    // Close on overlay click
    modal.onclick = (e) => {
      if (e.target === modal) {
        hideModal(modal);
      }
    };

    return modal;
  }

  // Show modal with animation
  function showModal(modal) {
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
      modal.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    });
  }

  // Hide modal with animation
  function hideModal(modal) {
    modal.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 200);
  }

  // Load kit content inline
  function loadKitContent(kitId, container, options) {
    container.innerHTML = '<div style="text-align: center; padding: 20px;">Loading...</div>';
    
    fetch(`${KITTIE_ORIGIN}/api/kits/${kitId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          container.innerHTML = '<div style="color: red;">Error loading kit</div>';
          return;
        }
        
        renderKitContent(data, container, options);
      })
      .catch(error => {
        console.error('KittieEmbed: Error loading kit:', error);
        container.innerHTML = '<div style="color: red;">Error loading kit</div>';
      });
  }

  // Render kit content
  function renderKitContent(kit, container, options) {
    const { name, description, logo_url, sections } = kit;
    
    let html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 100%;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);">
    `;
    
    if (logo_url) {
      html += `<img src="${logo_url}" alt="${name} logo" style="width: 80px; height: 80px; border-radius: 12px; margin-bottom: 16px;">`;
    }
    
    html += `
          <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0 0 8px 0;">${name}</h1>
    `;
    
    if (description) {
      html += `<p style="font-size: 16px; color: #6b7280; margin: 0;">${description}</p>`;
    }
    
    html += `</div>`;
    
    // Render sections
    sections.forEach(section => {
      if (section.type === 'gallery' || section.type === 'logos') {
        html += `<div style="padding: 20px;">`;
        if (section.title) {
          html += `<h2 style="font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 16px; text-align: center;">${section.title}</h2>`;
        }
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">`;
        section.assets.forEach(asset => {
          html += `<img src="${asset.url}" alt="${asset.alt_text || name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;">`;
        });
        html += `</div></div>`;
      } else if (section.type === 'team') {
        html += `<div style="padding: 20px;">`;
        if (section.title) {
          html += `<h2 style="font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 16px; text-align: center;">${section.title}</h2>`;
        }
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">`;
        section.team_members.forEach(member => {
          html += `
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: #f3f4f6; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #6b7280;">
                ${member.avatar_url ? `<img src="${member.avatar_url}" alt="${member.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <h3 style="font-size: 14px; font-weight: bold; color: #1f2937; margin: 0;">${member.name}</h3>
              ${member.title ? `<p style="font-size: 12px; color: #6b7280; margin: 0;">${member.title}</p>` : ''}
            </div>
          `;
        });
        html += `</div></div>`;
      }
    });
    
    html += `</div>`;
    
    container.innerHTML = html;
  }

  // Auto-load embeds on page load
  document.addEventListener('DOMContentLoaded', function() {
    const scripts = document.querySelectorAll('script[data-kit]');
    scripts.forEach(script => {
      const kitId = script.getAttribute('data-kit');
      const mode = script.getAttribute('data-mode') || 'inline';
      const containerId = script.getAttribute('data-container');
      
      if (mode === 'inline' && containerId) {
        window.KittieEmbed.load(kitId, containerId);
      } else if (mode === 'modal') {
        // Create a button to open modal
        const button = document.createElement('button');
        button.textContent = 'View Press Kit';
        button.style.cssText = `
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        `;
        button.onclick = () => window.KittieEmbed.open(kitId);
        
        script.parentNode.insertBefore(button, script);
      } else if (mode === 'fullpage') {
        // Redirect to full page - need to get brand/kit info from API
        fetch(`${KITTIE_ORIGIN}/api/kits/${kitId}`)
          .then(response => response.json())
          .then(data => {
            if (data.brand_slug && data.slug) {
              window.location.href = `${KITTIE_ORIGIN}/${data.brand_slug}/${data.slug}`;
            } else {
              // Fallback to old structure
              window.location.href = `${KITTIE_ORIGIN}/k/${kitId}`;
            }
          })
          .catch(() => {
            // Fallback to old structure
            window.location.href = `${KITTIE_ORIGIN}/k/${kitId}`;
          });
      }
    });
  });

})();
