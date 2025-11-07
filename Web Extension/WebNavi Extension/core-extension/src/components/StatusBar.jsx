export function StatusBar(props){
    return(
        <div className="status-bar">
        <div className="status-indicator">
          <div className={`status-dot ${props.status.toLowerCase()}`}></div>
          <span className="status-txt">{props.status}</span>
        </div>
        <button
          className={`wake-toggle ${props.wakeword ? "on" : "off"}`}
          onClick={() => props.setWakeWord(!props.wakeword)}
        >
          {props.wakeword ? "Wake: ON" : "Wake: OFF"}
        </button>
      </div>    
    )
}