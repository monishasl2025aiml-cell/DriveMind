import { createFileRoute } from '@tanstack/react-router';
import { Simulation } from '@/components/drivemind/pages';
export const Route = createFileRoute('/simulation')({
 head: () => ({meta:[{title:'Simulation — DriveMind'},{name:'description',content:'Run autonomous vehicle journeys and test road event decisions.'},{property:'og:title',content:'Simulation — DriveMind'},{property:'og:description',content:'Run autonomous vehicle journeys and test road event decisions.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: Simulation,
});
