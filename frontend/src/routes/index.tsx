import { createFileRoute } from '@tanstack/react-router';
import { Overview } from '@/components/drivemind/pages';
export const Route = createFileRoute('/')({
 head: () => ({meta:[{title:'Fleet overview — DriveMind'},{name:'description',content:'Monitor autonomous vehicles, journeys, and road network activity in DriveMind.'},{property:'og:title',content:'Fleet overview — DriveMind'},{property:'og:description',content:'Monitor autonomous vehicles, journeys, and road network activity in DriveMind.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: Overview,
});
