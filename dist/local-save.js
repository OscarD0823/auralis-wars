export const RECOVERY_INTERVAL=300000;
// Keep the fast local autosave. A second, bounded slot is a recovery copy, not cloud sync.
export function localSaveWriter(storage,key,now=Date.now){let lastRecovery=now();return raw=>{
 storage.setItem(key,raw);let recovery=true;
 try{if(!storage.getItem(key+'-recovery')||now()-lastRecovery>=RECOVERY_INTERVAL){storage.setItem(key+'-recovery',raw);lastRecovery=now();}}catch{recovery=false;}
 return{saved:true,recovery};
};}
