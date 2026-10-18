import { createFileRoute } from '@tanstack/react-router';
import { Analytics } from '@/components/drivemind/pages';
export const Route = createFileRoute('/analytics')({
 head: () => ({meta:[{title:'Fleet analytics — DriveMind'},{name:'description',content:'Compare fleet journeys, road events, and energy consumption.'},{property:'og:title',content:'Fleet analytics — DriveMind'},{property:'og:description',content:'Compare fleet journeys, road events, and energy consumption.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: Analytics,
});
