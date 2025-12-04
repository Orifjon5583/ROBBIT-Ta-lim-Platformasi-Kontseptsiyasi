import React from 'react';

function MessageModal({ show, userName, messageText, setMessageText, handleSendMessage, onClose }) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Xabar yuborish: {userName}</h3>
                <textarea 
                    value={messageText} 
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Xabaringizni yozing..."
                    rows="4"
                ></textarea>
                <div className="modal-actions">
                    <button onClick={handleSendMessage} className="send-btn">Yuborish</button>
                    <button onClick={onClose} className="cancel-btn">Bekor qilish</button>
                </div>
            </div>
        </div>
    );
}
export default MessageModal;