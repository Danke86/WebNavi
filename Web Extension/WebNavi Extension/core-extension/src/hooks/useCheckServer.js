import { useEffect} from "react";

export function useCheckServer(props) {
     useEffect(() => {
        const checkServer = async () => {
          try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ping`);
            if (res.ok) {
              props.setStatus("Idle"); // server is online
            } else {
              props.setStatus("Offline");
            }
          } catch (err) {
            console.log(err)
            props.setStatus(`Offline`); // server unreachablew
          }
        };
    
        checkServer(); // check immediately
        const interval = setInterval(checkServer, 5000); // check every 5 seconds
    
        return () => clearInterval(interval);
      }, []);
    
}