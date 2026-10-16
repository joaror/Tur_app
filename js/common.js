/* Statuslinje for mobiltelefon øverst på skjermen - er felles for alle sider. */
function createStatusBarHtml() {
  return /*HTML*/ `
        <div class="status-bar">
            <span class="time">12:00</span>
            <div class="status-icons">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11.29 11.29c.19.19.44.29.71.29.27 0 .52-.1.71-.29L23.71 9.09c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"></path>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4.74 6.48 5.87 5.51 7.37C4.55 8.87 4 10.6 4 12.4c0 3.31 2.69 6 6 6h5.4c2.47 0 4.6-1.79 4.93-4.14l1.58-4.59c.13-.48-.22-.95-.75-.95h-.19C19.47 8.72 18.47 8 17.33 8H14v3.34L15.67 4z"></path>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 4h-3V2h-4v2H7v18h10V4z"></path>
                </svg>
            </div>
        </div>
    `;
}
