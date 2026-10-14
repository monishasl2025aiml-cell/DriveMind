import { createFileRoute } from '@tanstack/react-router';
import { HistoryPage } from '@/components/drivemind/pages';
export const Route = createFileRoute('/history')({
 head: () => ({meta:[{title:'Trip history — DriveMind'},{name:'description',content:'Explore journeys, road events, and decision timelines.'},{property:'og:title',content:'Trip history — DriveMind'},{property:'og:description',content:'Explore journeys, road events, and decision timelines.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: HistoryPage,
});
