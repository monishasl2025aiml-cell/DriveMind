import { createFileRoute } from '@tanstack/react-router';
import { Vehicles } from '@/components/drivemind/pages';
export const Route = createFileRoute('/vehicles')({
 head: () => ({meta:[{title:'Vehicles — DriveMind'},{name:'description',content:'Manage your DriveMind fleet and vehicle battery status.'},{property:'og:title',content:'Vehicles — DriveMind'},{property:'og:description',content:'Manage your DriveMind fleet and vehicle battery status.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: Vehicles,
});
