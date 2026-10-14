import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Vehicle = {id:number;code:string;model:string;battery:number;status:string};
export type TripEvent = {time:string;type:string;decision:string;reason:string};
export type Trip = {id:number;vehicle:string;source:string;destination:string;status:string;distance:number;batteryUsed:number;startedAt:string;timeline:TripEvent[]};
export const nodes:Record<string,{x:number;y:number}> = {A:{x:90,y:100},B:{x:330,y:75},C:{x:600,y:115},D:{x:145,y:320},E:{x:395,y:280},F:{x:650,y:340}};
export const edges:[string,string,number][] = [['A','B',5],['B','C',6],['A','D',4],['B','E',5],['D','E',4],['E','F',5],['C','F',7],['D','F',9]];
export const places:Record<string,string>={A:'North terminal',B:'Central junction',C:'East terminal',D:'West district',E:'City center',F:'South terminal'};
export const rules:Record<string,{label:string;decision:string;reason:string;speed:number}>={CLEAR:{label:'Clear road',decision:'Moving',reason:'Road is clear. Continuing on the planned route.',speed:40},RED_SIGNAL:{label:'Red signal',decision:'Stopped',reason:'Red traffic signal. Waiting for a clear road.',speed:0},PEDESTRIAN:{label:'Pedestrian',decision:'Stopped',reason:'Pedestrian within unsafe distance.',speed:0},OBSTACLE:{label:'Obstacle',decision:'Stopped',reason:'Obstacle detected ahead.',speed:0},HEAVY_TRAFFIC:{label:'Heavy traffic',decision:'Slowing down',reason:'Heavy traffic on the current road segment.',speed:15},ROAD_BLOCK:{label:'Road block',decision:'Changing route',reason:'Road blocked. Selecting an alternative route.',speed:25},LOW_BATTERY:{label:'Low battery',decision:'Heading to charger',reason:'Battery below 20%. Seeking a charging station.',speed:25}};
export function findRoute(src:string,dst:string,blocked:string[]=[]):string[]{
 const dist:Record<string,number>={[src]:0},prev:Record<string,string>={},todo=new Set(Object.keys(nodes));
 while(todo.size){const u=[...todo].filter(n=>dist[n]!==undefined).sort((a,b)=>(dist[a]??Infinity)-(dist[b]??Infinity))[0];if(!u)return [];const current=dist[u];if(current===undefined)return [];todo.delete(u);if(u===dst)break;edges.forEach(([a,b,w])=>{if(blocked.includes([a,b].sort().join()))return;const v=a===u?b:b===u?a:null;if(v&&todo.has(v)&&(dist[v]===undefined||current+w<(dist[v]??Infinity))){dist[v]=current+w;prev[v]=u;}});}
 if(dist[dst]===undefined)return [];const path=[dst];while(path[0]!==src){const first=path[0];if(!first)return [];const p=prev[first];if(!p)return [];path.unshift(p);}return path;
}
const initialVehicles: Vehicle[] = [];
const initialTrips: Trip[] = [];
type Store={vehicles:Vehicle[];setVehicles:React.Dispatch<React.SetStateAction<Vehicle[]>>;trips:Trip[];setTrips:React.Dispatch<React.SetStateAction<Trip[]>>;signedIn:boolean;setSignedIn:React.Dispatch<React.SetStateAction<boolean>>};
const Context=createContext<Store|null>(null);
export function DriveProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/vehicles')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        return response.json();
      })
      .then((data: Vehicle[]) => {
        setVehicles(data);
      })
      .catch((error) => {
        console.error('Error loading vehicles:', error);
      });
  }, []);

  return (
    <Context.Provider
      value={{
        vehicles,
        setVehicles,
        trips,
        setTrips,
        signedIn,
        setSignedIn,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDrive(){const store=useContext(Context);if(!store)throw new Error('DriveProvider required');return store;}
