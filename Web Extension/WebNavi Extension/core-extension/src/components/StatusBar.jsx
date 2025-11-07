export function StatusBar(props){
    return(
        <div className="status-bar">
        <div className="status-indicator">
          <div className={`status-dot ${props.recording ? "recording" : props.status.toLowerCase()}`}></div>
          <span className="status-txt">{props.status}</span>
        </div>
        <button
          className={`wake-toggle ${props.listening ? "on" : "off"}`}
          onClick={() => props.setListening(!props.listening)}
        >
          {props.listening ? "Wake: ON" : "Wake: OFF"}
        </button>
      </div>    
    )
}