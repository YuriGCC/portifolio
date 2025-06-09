export function initBackground() {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.puzzle-container');
        let pieceCount = 0;
        let pieces = [];
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
            '#FB5607', '#8338EC', '#3A86FF', '#FF006E'
        ];
        
        function updatePiecesQuantity() {
            pieceCount = 0;
            for (let i =0; i <= window.innerHeight; i++) {
                if (((pieceCount * 100) < (window.innerWidth * 0.6)) &&
                ((pieceCount * 100) < (window.innerWidth * 0.8))) {
                    if (i %100 == 0) {
                        pieceCount+=8;
                    }
                }
            }
            
            if (pieces.length > 0) {
                for (let i=0; i < pieces.length; i++) {
                    const element = pieces[i].element;

                    element.removeEventListener('load', setPieceColorFromEvent);
                    element.remove();
                }
                pieces = []
            }
            createPieces()
        }

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getPieceFormat(type) {
            switch (type) {
                case 1:
                    return '../assets/svgs/piece_type1.svg';
                case 2:
                    return '../assets/svgs/piece_type2.svg';
                case 3:
                    return '../assets/svgs/piece_type3.svg';
                case 4:
                    return '../assets/svgs/piece_type4.svg';
                case 5:
                    return '../assets/svgs/piece_type5.svg';
                case 6:
                    return '../assets/svgs/piece_type6.svg';
                case 7:
                    return '../assets/svgs/piece_type7.svg';
                case 8:
                    return '../assets/svgs/piece_type8.svg';
                default:
                    return '../assets/svgs/piece_type1.svg';
            }
        }

        function setPieceColorFromEvent(event) {
            const svgObject = event.currentTarget;
            const svgDoc = svgObject.getSVGDocument();
            if (!svgDoc) return;
        
            const paths = svgDoc.querySelectorAll('path, rect, circle');
            paths.forEach(el => {
                el.style.fill = colors[Math.floor(Math.random() * colors.length)];
            });
        }

        function createPieces() {
            for (let i = 0; i < pieceCount; i++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                
                const size = 80 + Math.random() * 70;
                const x = Math.random() * (window.innerWidth - size);
                const y = Math.random() * (window.innerHeight - size);
                
                piece.innerHTML = `
                    <object type="image/svg+xml" 
                            data=${getPieceFormat(randomInt(1, 8))}
                            width="${size}" 
                            height="${size}"
                            class="piece">
                    </object>
                `;

                piece.querySelector('object').addEventListener('load', setPieceColorFromEvent);
                piece.style.left = `${x}px`;
                piece.style.top = `${y}px`;
                
                container.appendChild(piece);
                pieces.push({
                    element: piece,
                    x, y, size,
                    dx: (Math.random() - 0.5) * 0.5,
                    dy: (Math.random() - 0.5) * 0.5,
                    dragging: false
                });
            }
        }
    
        function checkCollisions() {
            for (let i = 0; i < pieces.length; i++) {
                for (let j = i + 1; j < pieces.length; j++) {
                    const p1 = pieces[i];
                    const p2 = pieces[j];
                    
                    const dx = (p1.x + p1.size/2) - (p2.x + p2.size/2);
                    const dy = (p1.y + p1.size/2) - (p2.y + p2.size/2);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < (p1.size/2 + p2.size/2) * 0.8) {
                        const angle = Math.atan2(dy, dx);
                        const force = 0.1;
                        
                        p1.dx += Math.cos(angle) * force;
                        p1.dy += Math.sin(angle) * force;
                        p2.dx -= Math.cos(angle) * force;
                        p2.dy -= Math.sin(angle) * force;
                    }
                }
            }
        }
    
        function checkOverlap(piece) {
            const rect1 = piece.element.getBoundingClientRect();
            
            for (const otherPiece of pieces) {
                if (otherPiece === piece || otherPiece.dragging) continue;
                
                const rect2 = otherPiece.element.getBoundingClientRect();
                
                if (!(rect1.right < rect2.left || 
                      rect1.left > rect2.right || 
                      rect1.bottom < rect2.top || 
                      rect1.top > rect2.bottom)) {
                    
                    if (parseInt(otherPiece.element.style.zIndex || 1) > parseInt(piece.element.style.zIndex || 1)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function managePieceLayers() {
            pieces.sort((a, b) => a.y - b.y);
        
            pieces.forEach((piece, index) => {
                if (!piece.dragging) {
                    piece.element.style.zIndex = index + 1;
                }
            });
            
            pieces.forEach(piece => {
                if (checkOverlap(piece)) {
                    piece.element.classList.add('underneath');
                } else {
                    piece.element.classList.remove('underneath');
                }
            });
        }
    

        function getTopPieceAt(x, y) {
            const sortedPieces = [...pieces].sort((a, b) => 
                parseInt(b.element.style.zIndex || 1) - parseInt(a.element.style.zIndex || 1));
            
            for (const piece of sortedPieces) {
                const rect = piece.element.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && 
                    y >= rect.top && y <= rect.bottom) {
                    return piece;
                }
            }
            return null;
        }

        function setupDragAndDrop() {
            let activePiece = null;
            let offsetX, offsetY;
            
            function startDrag(e) {
                const clientX = e.clientX || e.touches[0].clientX;
                const clientY = e.clientY || e.touches[0].clientY;
                
                activePiece = getTopPieceAt(clientX, clientY);
                
                if (activePiece) {
                    activePiece.dragging = true;
                    activePiece.element.style.zIndex = 100;
                    
                    const rect = activePiece.element.getBoundingClientRect();
                    offsetX = clientX - rect.left;
                    offsetY = clientY - rect.top;
                    
                    e.preventDefault();
                }
            }
            
            function drag(e) {
                if (activePiece) {
                    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                    
                    activePiece.x = clientX - offsetX;
                    activePiece.y = clientY - offsetY;
                    
                    activePiece.element.style.left = `${activePiece.x}px`;
                    activePiece.element.style.top = `${activePiece.y}px`;
                    
                    e.preventDefault();
                }
            }
            
            function stopDrag() {
                if (activePiece) {
                    activePiece.dragging = false;
                    activePiece.element.style.zIndex = 1;
                    managePieceLayers();
                    activePiece = null;
                }
            }
            
            document.addEventListener('pointerdown', startDrag);
            document.addEventListener('pointermove', drag);
            document.addEventListener('pointerup', stopDrag);
        }
    
        function updatePieces() {
            pieces.forEach(piece => {
                if (!piece.dragging) {
                    piece.x += piece.dx;
                    piece.y += piece.dy;
                    
                    if (piece.x < 0 || piece.x + piece.size > window.innerWidth) {
                        piece.dx *= -0.8;
                        piece.x = Math.max(0, Math.min(piece.x, window.innerWidth - piece.size));
                    }
                    if (piece.y < 0 || piece.y + piece.size > window.innerHeight) {
                        piece.dy *= -0.8;
                        piece.y = Math.max(0, Math.min(piece.y, window.innerHeight - piece.size));
                    }
                    
                    piece.element.style.left = `${piece.x}px`;
                    piece.element.style.top = `${piece.y}px`;
                }
            });
            
            managePieceLayers();
            checkCollisions();
            requestAnimationFrame(updatePieces);
            window.addEventListener('resize', updatePiecesQuantity);
        }
        
        updatePiecesQuantity();
        setupDragAndDrop();
        updatePieces();
        
        window.addEventListener('resize', () => {
            updatePieces()
            pieces.forEach(piece => {
                piece.x = Math.min(piece.x, window.innerWidth - piece.size);
                piece.y = Math.min(piece.y, window.innerHeight - piece.size);
                piece.element.style.left = `${piece.x}px`;
                piece.element.style.top = `${piece.y}px`;
            });
        });
    });
};
