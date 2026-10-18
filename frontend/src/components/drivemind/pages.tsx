import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { CarFront, ArrowUpRight, ArrowRight, Route as RouteIcon, CircleCheck, OctagonAlert, Battery, Plus, Search, Download, X, Trash2, Play, Square, MapPin, Activity, TrafficCone, PersonStanding, CircleStop, Zap, Check, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDrive, rules, nodes, places, findRoute, type Trip, type TripEvent, type Vehicle } from './store';
import { RoadMap } from './road-map';
export function PageHeading({title,subtitle,action}:{title:string;subtitle:string;action?:React.ReactNode}){return <div className="page-heading"><div><div className="eyebrow">FLEET OPERATIONS</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>}
function Status({value}:{value:string}){return <span className={`status ${['COMPLETED','AVAILABLE','Moving'].includes(value)?'good':value==='Stopped'?'bad':'warning'}`}><i/>{value.toLowerCase().replaceAll('_',' ')}</span>}
function BatteryLevel({value}:{value:number}){return <span className={`battery-value ${value<40?'low':''}`}><Battery size={17}/>{value}%</span>}
export function TripTable({trips,compact=false}:{trips:Trip[];compact?:boolean}){const [selected,setSelected]=useState<Trip|null>(null);return <><div className="table-scroll"><table><thead><tr><th>TRIP ID</th><th>VEHICLE</th><th>ROUTE</th><th>STATUS</th><th>BATTERY USED</th>{!compact&&<th>EVENTS</th>}<th>STARTED</th><th/></tr></thead><tbody>{trips.map(t=><tr key={t.id} tabIndex={0} onClick={()=>setSelected(t)} onKeyDown={e=>{if(e.key==='Enter')setSelected(t)}}><td className="table-id">#TRP-{String(t.id).padStart(3,'0')}</td><td><span className="table-vehicle"><CarFront size={15}/>{t.vehicle}</span></td><td><span className="route-label">{t.source}<ArrowRight size={13}/>{t.destination}</span></td><td><Status value={t.status}/></td><td><BatteryLevel value={t.batteryUsed}/></td>{!compact&&<td>{t.timeline.length}</td>}<td className="table-date">{new Date(t.startedAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}<small>{new Date(t.startedAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</small></td><td><ChevronRight size={15}/></td></tr>)}</tbody></table>{!trips.length&&<div className="empty-state">No journeys match your filters.</div>}</div>{selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><aside className="trip-drawer" role="dialog" aria-modal="true" aria-label="Trip details" onClick={e=>e.stopPropagation()}><Button variant="ghost" size="icon" aria-label="Close trip details" className="drawer-close" onClick={()=>setSelected(null)}><X/></Button><span className="eyebrow">JOURNEY DETAILS</span><h2>Trip #TRP-{String(selected.id).padStart(3,'0')}</h2><p>{selected.vehicle} · {places[selected.source]} → {places[selected.destination]}</p><Status value={selected.status}/><div className="drawer-metrics"><div><strong>{selected.distance} km</strong><small>Distance</small></div><div><strong>{selected.batteryUsed}%</strong><small>Battery used</small></div></div><h3>Event timeline</h3><ul className="timeline">{selected.timeline.map((e,i)=><li key={i}><span className="timeline-dot"/><small>{e.time}</small><strong>{rules[e.type]?.label||e.type}</strong><Status value={e.decision}/><p>{e.reason}</p></li>)}</ul>{!selected.timeline.length&&<p>No road events recorded.</p>}</aside></div>}</>}
function Metric({label,value,icon:Icon,note,tone}:{label:string;value:string|number;icon:typeof CarFront;note:string;tone:string}){return <div className="metric-card"><div className="metric-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><div className={`metric-note ${tone}`}><span className="metric-dot"/>{note}</div></div>}
export function Overview(){const {vehicles,trips}=useDrive();const completed=trips.filter(t=>t.status==='COMPLETED'),active=trips.filter(t=>t.status==='ACTIVE');const stops=trips.reduce((n,t)=>n+t.timeline.filter(e=>e.decision==='Stopped').length,0);const avg=completed.length?Math.round(completed.reduce((n,t)=>n+t.batteryUsed,0)/completed.length):0;return <><PageHeading title="Fleet overview" subtitle="A clear view of your fleet. Every vehicle, every journey." action={<Button asChild><Link to="/simulation"><Plus/>Start a journey</Link></Button>}/><div className="overview-date"><span><span className="live-dot"/>LIVE OVERVIEW</span><span>Wednesday, 7 October 2026</span></div><div className="metrics"><Metric label="Total vehicles" value={vehicles.length.toString().padStart(2,'0')} icon={CarFront} note={`${vehicles.filter(v=>v.status==='AVAILABLE').length} available for dispatch`} tone="good"/><Metric label="Active trips" value={active.length.toString().padStart(2,'0')} icon={RouteIcon} note={active.length?'Journeys in progress':'No journeys in progress'} tone="neutral"/><Metric label="Completed trips" value={completed.length.toString().padStart(2,'0')} icon={CircleCheck} note="All destinations reached" tone="good"/><Metric label="Emergency stops" value={stops.toString().padStart(2,'0')} icon={OctagonAlert} note="Safety protocols triggered" tone="warning"/><Metric label="Avg. battery used" value={`${avg}%`} icon={Battery} note="Per completed journey" tone="neutral"/></div><div className="overview-middle"><section className="network-section"><div className="section-heading"><div><h2>Network overview</h2><p>Your connected road network</p></div><Link to="/simulation" className="text-link">Open simulation<ArrowUpRight size={15}/></Link></div><RoadMap/><div className="network-bottom"><div><RouteIcon size={17}/><span>Connected network</span></div><span>All roads available<Check size={14}/></span></div></section><section className="fleet-section"><div className="section-heading"><div><h2>Fleet status</h2><p>Ready for the road</p></div><span className="count-label">{vehicles.length} vehicles</span></div><div className="fleet-list">{vehicles.slice(0,4).map(v=><div className="fleet-item" key={v.id}><div className="vehicle-icon"><CarFront size={22}/></div><div className="fleet-info"><strong>{v.code}</strong><span>{v.model}</span></div><div className="fleet-right"><BatteryLevel value={v.battery}/><Status value={v.status}/></div></div>)}</div><div className="fleet-summary"><span><i className="live-dot"/>{vehicles.filter(v=>v.status==='AVAILABLE').length} available</span><span><i className="warning-dot"/>{vehicles.filter(v=>v.status==='MAINTENANCE').length} in maintenance</span></div><Button variant="outline" asChild className="view-fleet"><Link to="/vehicles">View all vehicles<ArrowRight/></Link></Button></section></div><section className="recent-section"><div className="section-heading"><div><h2>Recent journeys</h2><p>The latest activity across your fleet</p></div><Link to="/history" className="text-link">View trip history<ArrowRight size={15}/></Link></div><TripTable trips={trips.slice(0,5)} compact/></section></>}
export function Vehicles(){const {vehicles,setVehicles,trips}=useDrive();const [query,setQuery]=useState(''),[adding,setAdding]=useState(false),[error,setError]=useState('');return <><PageHeading title="Vehicles" subtitle={`${vehicles.length} registered vehicles in your fleet.`} action={<Button onClick={()=>setAdding(true)}><Plus/>Add vehicle</Button>}/><div className="list-toolbar"><div className="search-field"><Search size={17}/><input aria-label="Search vehicles" placeholder="Search code or model…" value={query} onChange={e=>setQuery(e.target.value)}/></div><span className="muted-copy">{vehicles.filter(v=>v.status==='AVAILABLE').length} available for dispatch</span></div><div className="vehicle-grid">{vehicles.filter(v=>(v.code+' '+v.model).toLowerCase().includes(query.toLowerCase())).map(v=><article className="vehicle-card" key={v.id}><div className="vehicle-card-top"><div className="vehicle-icon"><CarFront size={26}/></div><Status value={v.status}/></div><h2>{v.code}</h2><p>{v.model}</p><div className="vehicle-battery"><span>Battery level</span><BatteryLevel value={v.battery}/></div><progress max="100" value={v.battery} className={v.battery<40?'low':''}/><div className="vehicle-card-bottom"><span>{trips.filter(t=>t.vehicle===v.code).length} journeys</span><Button size="icon" variant="ghost" aria-label={`Remove ${v.code}`} title="Remove vehicle" disabled={v.status==='ACTIVE'} onClick={async () => {
  if (!window.confirm(`Remove ${v.code} from the fleet?`)) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/vehicles/${v.id}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete vehicle');
    }

    setVehicles(vs => vs.filter(x => x.id !== v.id));

  } catch (error) {
    console.error('Delete error:', error);
    alert('Could not delete vehicle.');
  }
}}><Trash2 size={16}/></Button></div></article>)}</div>{adding&&<div className="modal-backdrop"><form className="form-modal" role="dialog" aria-modal="true" aria-label="Add vehicle" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget),code=String(f.get('code')).trim(),model=String(f.get('model')).trim();if(!code||!model)return;if(vehicles.some(v=>v.code===code)){setError('A vehicle with this code already exists.');return}fetch('http://localhost:8080/vehicles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: code,
    model: model
  })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Failed to add vehicle');
  }
  return response.json();
})
.then((newVehicle: Vehicle) => {
  setVehicles(vs => [...vs, newVehicle]);
  setAdding(false);
  setError('');
})
.catch(error => {
  console.error(error);
  setError('Could not add vehicle.');
});}}><div className="section-heading"><h2>Add vehicle</h2><Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={()=>setAdding(false)}><X/></Button></div><label>Vehicle code<input required name="code" pattern="[A-Za-z0-9-]{3,12}" placeholder="AV-301"/></label><label>Model<input required name="model" placeholder="Aero S"/></label>{error&&<p role="alert" className="text-destructive">{error}</p>}<Button type="submit"><Plus/>Add vehicle</Button></form></div>}</>}
function exportTrips(trips:Trip[]){const blob=new Blob(['Trip,Vehicle,Source,Destination,Status,Distance,Battery used\n'+trips.map(t=>[t.id,t.vehicle,t.source,t.destination,t.status,t.distance,t.batteryUsed].join(',')).join('\n')],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='drivemind-journeys.csv';a.click();URL.revokeObjectURL(url)}
export function HistoryPage(){const {trips}=useDrive();const [query,setQuery]=useState(''),[status,setStatus]=useState('ALL');const filtered=trips.filter(t=>(status==='ALL'||t.status===status)&&(t.vehicle+' '+t.id).toLowerCase().includes(query.toLowerCase()));return <><PageHeading title="Trip history" subtitle="A record of every journey and every decision." action={<Button variant="outline" onClick={()=>exportTrips(filtered)}><Download/>Export trips</Button>}/><div className="list-toolbar"><div className="search-field"><Search size={17}/><input aria-label="Search trips" placeholder="Search trip or vehicle…" value={query} onChange={e=>setQuery(e.target.value)}/></div><select aria-label="Filter trip status" value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">All statuses</option><option value="COMPLETED">Completed</option><option value="ACTIVE">Active</option></select></div><section className="history-section"><TripTable trips={filtered}/></section><p className="muted-copy table-count">{filtered.length} journeys</p></>}
export function Analytics(){const {trips}=useDrive();const types:Record<string,number>={},vs:Record<string,number>={};trips.forEach(t=>{vs[t.vehicle]=(vs[t.vehicle]||0)+1;t.timeline.forEach(e=>types[e.type]=(types[e.type]||0)+1)});const bars=(data:Record<string,number>,percent=false)=><div className="analytics-bars">{Object.entries(data).map(([k,v])=><div className="analytics-bar" key={k}><div><span>{rules[k]?.label||k}</span><strong>{v}{percent?'%':''}</strong></div><progress value={v} max={Math.max(...Object.values(data),1)}/></div>)}{!Object.keys(data).length&&<p>No journey data yet.</p>}</div>;return <><PageHeading title="Fleet analytics" subtitle="Operational insights from your journeys and road events."/><div className="analytics-grid"><section><div className="section-heading"><h2>Events by type</h2><Activity size={19}/></div>{bars(types)}</section><section><div className="section-heading"><h2>Trips per vehicle</h2><CarFront size={19}/></div>{bars(vs)}</section><section className="wide"><div className="section-heading"><div><h2>Battery used per trip</h2><p>Energy consumption across completed journeys</p></div><Battery size={19}/></div>{bars(Object.fromEntries(trips.filter(t=>t.status==='COMPLETED').map(t=>[`Trip #TRP-${String(t.id).padStart(3,'0')}`,t.batteryUsed])),true)}</section></div></>}
type Sim={id:number;route:string[];seg:number;p:number;speed:number;battery:number;used:number;distance:number;decision:string;reason:string;blocked:string[];done:boolean;low:boolean};
export function Simulation(){const {vehicles,setVehicles,trips,setTrips}=useDrive();const [vehicle,setVehicle]=useState('1'),[source,setSource]=useState('A'),[destination,setDestination]=useState('F'),[sim,setSim]=useState<Sim|null>(null),[error,setError]=useState(''),[log,setLog]=useState<TripEvent[]>([]);
const [backendTrip, setBackendTrip] = useState<any>(null);
const addLog = (
  type: string,
  decision: string,
  reason: string,
  id: number
) => {
  const event = {
    type,
    decision,
    reason,
    time: new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  // Update frontend
  setLog(l => [event, ...l]);

  setTrips(ts =>
    ts.map(t =>
      t.id === id
        ? { ...t, timeline: [...t.timeline, event] }
        : t
    )
  );

  // Save event to backend / Supabase
  if (backendTrip?.id) {
    fetch('http://localhost:8080/trip-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripId: backendTrip.id,
        eventType: type,
        decision: decision,
        reason: reason
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save trip event');
        }
        return response.json();
      })
      .then(savedEvent => {
        console.log('Trip event saved:', savedEvent);
      })
      .catch(error => {
        console.error('Trip event error:', error);
      });
  }
};
function fire(type:string){if(!sim||sim.done)return;const rule=rules[type];if(!rule)return;const current=sim.route[sim.seg],nextNode=sim.route[sim.seg+1];if(!current||!nextNode)return;let route=sim.route,blocked=sim.blocked,decision=rule.decision,reason=rule.reason,speed=rule.speed,seg=sim.seg,p=sim.p;if(type==='ROAD_BLOCK'){blocked=[...blocked,[current,nextNode].sort().join()];const next=findRoute(current,destination,blocked);if(next.length>1){route=next;seg=0;p=0}else{speed=0;decision='Stopped';reason='Road blocked. No alternative route available.'}}if(type==='LOW_BATTERY'){const next=findRoute(current,'E',blocked);if(next.length>1){route=next;seg=0;p=0;reason='Routing to the charging station at City center.'}else{speed=0;decision='Stopped';reason='Charging station reached at City center.'}}setSim({...sim,route,blocked,decision,reason,speed,seg,p,low:sim.low||type==='LOW_BATTERY'});addLog(type,decision,reason,sim.id)}
useEffect(()=>{if(!sim||sim.done||sim.speed===0)return;const timer=setInterval(()=>setSim(s=>{if(!s||s.done)return s;const a=nodes[s.route[s.seg]??source],b=nodes[s.route[s.seg+1]??destination];if(!a||!b)return {...s,done:true,speed:0};const step=s.speed*.22,p=s.p+step/Math.hypot(b.x-a.x,b.y-a.y),drain=s.speed*.0012;const next={...s,p,battery:Math.max(0,s.battery-drain),used:s.used+drain,distance:s.distance+step/20};if(p>=1){next.seg++;next.p=0;if(next.seg>=s.route.length-1){next.done=true;next.speed=0;next.decision=s.low?'Charging station reached':'Trip complete';next.reason=`Arrived at ${places[s.route.at(-1)||destination]}.`;}}return next}),100);return ()=>clearInterval(timer)},[sim?.id,sim?.done,sim?.speed,destination]);
useEffect(() => {
  if (!sim?.done) return;

  const updatedBattery = Math.round(sim.battery);

  setTrips(ts =>
    ts.map(t =>
      t.id === sim.id
        ? {
            ...t,
            status: 'COMPLETED',
            distance: Math.round(sim.distance),
            batteryUsed: Math.max(1, Math.round(sim.used))
          }
        : t
    )
  );
  if (backendTrip?.id) {
  const completedTrip = {
    ...backendTrip,
    status: 'COMPLETED',
    distance: Math.round(sim.distance),
    batteryUsed: Math.max(1, Math.round(sim.used)),
    endedAt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 23)
  };

  fetch(`http://localhost:8080/trips/${backendTrip.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(completedTrip)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to complete trip');
      }
      return response.json();
    })
    .then(updatedTrip => {
      console.log('Trip completed:', updatedTrip);
      setBackendTrip(updatedTrip);
    })
    .catch(error => {
      console.error('Trip completion error:', error);
    });
}

  const currentVehicle = vehicles.find(
    v => String(v.id) === vehicle
  );

  if (!currentVehicle) return;

  const updatedVehicle = {
    ...currentVehicle,
    battery: updatedBattery,
    status: 'AVAILABLE'
  };

  fetch(`http://localhost:8080/vehicles/${currentVehicle.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedVehicle)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update vehicle');
      }

      return response.json();
    })
    .then(updated => {
      setVehicles(vs =>
        vs.map(v =>
          v.id === updated.id ? updated : v
        )
      );
    })
    .catch(error => {
      console.error('Vehicle update error:', error);
    });

}, [sim?.done]);
useEffect(()=>{if(sim&&sim.battery<20&&!sim.low&&!sim.done)fire('LOW_BATTERY')},[sim?.battery]);
const available=vehicles.filter(v=>v.status==='AVAILABLE'||String(v.id)===vehicle&&v.status==='ACTIVE');const position=sim?sim.done?nodes[sim.route.at(-1)||destination]:(()=>{const a=nodes[sim.route[sim.seg]??source],b=nodes[sim.route[sim.seg+1]??destination];return a&&b?{x:a.x+(b.x-a.x)*sim.p,y:a.y+(b.y-a.y)*sim.p}:undefined})():undefined;
return <><PageHeading title="Simulation" subtitle="Your road network. Real-time decisions. Complete control." action={<span className="simulation-mode"><span className="live-dot"/>Decision engine online</span>}/><form className="trip-form" onSubmit={e=>{e.preventDefault();if(source===destination){setError('Choose a different destination.');return}const v=vehicles.find(v=>String(v.id)===vehicle&&v.status==='AVAILABLE');if(!v){setError('Select an available vehicle.');return}const route=findRoute(source,destination);if(route.length<2){setError('No route available.');return}const id=Math.max(0,...trips.map(t=>t.id))+1;setError('');setLog([]);setTrips(ts=>[{id,vehicle:v.code,source,destination,status:'ACTIVE',distance:0,batteryUsed:0,startedAt:new Date().toISOString(),timeline:[]},...ts]);

setTrips(ts => [
  {
    id,
    vehicle: v.code,
    source,
    destination,
    status: 'ACTIVE',
    distance: 0,
    batteryUsed: 0,
    startedAt: new Date().toISOString(),
    timeline: []
  },
  ...ts
]);

fetch('http://localhost:8080/trips', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    vehicle: v.code,
    source: source,
    destination: destination,
    status: 'ACTIVE',
    distance: 0,
    batteryUsed: 0
  })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Failed to create trip');
  }
  return response.json();
})
.then(createdTrip => {
  setBackendTrip(createdTrip);
  console.log('Trip created:', createdTrip);
})
.catch(error => {
  console.error('Trip creation error:', error);
});

const activeVehicle = {
  ...v,
  status: 'ACTIVE'
};

fetch(`http://localhost:8080/vehicles/${v.id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(activeVehicle)
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update vehicle status');
    }
    return response.json();
  })
  .then(updated => {
    setVehicles(vs =>
      vs.map(x => x.id === updated.id ? updated : x)
    );
  })
  .catch(error => {
    console.error('Vehicle status update error:', error);
  });setSim({id,route,seg:0,p:0,speed:40,battery:v.battery,used:0,distance:0,decision:'Moving',reason:'Trip started. Following the planned route.',blocked:[],done:false,low:false})}}><label><CarFront size={15}/>Vehicle<select aria-label="Vehicle" value={vehicle} disabled={!!sim&&!sim.done} onChange={e=>setVehicle(e.target.value)}>{available.map(v=><option value={v.id} key={v.id}>{v.code} · {v.battery}%</option>)}</select></label><label><MapPin size={15}/>From<select aria-label="From" value={source} disabled={!!sim&&!sim.done} onChange={e=>setSource(e.target.value)}>{Object.keys(nodes).map(k=><option key={k} value={k}>{k} · {places[k]}</option>)}</select></label><ArrowRight className="form-arrow" size={20}/><label><MapPin size={15}/>Destination<select aria-label="Destination" value={destination} disabled={!!sim&&!sim.done} onChange={e=>setDestination(e.target.value)}>{Object.keys(nodes).map(k=><option key={k} value={k}>{k} · {places[k]}</option>)}</select></label><Button type="submit" disabled={!!sim&&!sim.done||!available.length}><Play/>Start trip</Button></form>{error&&<p role="alert" className="text-destructive">{error}</p>}<div className="simulation-layout"><div><RoadMap path={sim?.route||findRoute(source,destination)} position={position} blocked={sim?.blocked}/><section className="event-section"><div className="section-heading"><h2>Road events</h2><span className="count-label">7 event types</span></div><div className="event-controls">{Object.entries(rules).map(([type,r],i)=>{const Icon=[Check,CircleStop,PersonStanding,TrafficCone,CarFront,OctagonAlert,Zap][i]??Check;return <Button variant="outline" disabled={!sim||sim.done} onClick={()=>fire(type)} key={type}><Icon/>{r.label}</Button>})}</div></section></div><aside className="decision-section"><span className="eyebrow">LATEST DECISION</span><div className={`decision-title ${sim?.speed===0&&!sim.done?'bad':'good'}`}><span className="decision-icon">{sim?.speed===0&&!sim.done?<Square/>:<Activity/>}</span>{sim?.decision||'Standing by'}</div><p className="decision-reason">{sim?.reason||'No active journey.'}</p><div className="sim-telemetry"><div><span>Speed</span><strong>{sim?.speed||0}<small> km/h</small></strong></div><div><span>Location</span><strong>{sim?sim.done?sim.route.at(-1):`${sim.route[sim.seg]} → ${sim.route[sim.seg+1]}`:'—'}</strong></div><div><span>Destination</span><strong>{sim?sim.low?'E · Charger':destination:'—'}</strong></div><div><span>Battery</span><strong>{sim?`${sim.battery.toFixed(1)}%`:'—'}</strong></div><progress max="100" value={sim?.battery||0}/></div><div className="decision-log-heading"><h3>Decision log</h3><span>{log.length}</span></div><ul className="decision-log">{log.map((e,i)=><li key={i}><span className="timeline-dot"/><strong>{rules[e.type]?.label}</strong><small>{e.time}</small><p>{e.decision}</p></li>)}</ul>{!log.length&&<div className="log-empty"><Clock size={21}/><span>No events recorded</span></div>}</aside></div></>}
