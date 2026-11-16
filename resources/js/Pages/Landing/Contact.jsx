import LandingLayout from '../../Components/landing/LandingLayout';
import ContactSection from '../../Components/landing/sections/ContactSection';
import VenueSection from '../../Components/landing/sections/VenueSection';

export default function Contact({ layout, contact, venues }) {
    return (
        <LandingLayout layout={layout} title="Kontak" current="Kontak">
            <ContactSection contact={contact} page />
            <VenueSection venues={venues} />
        </LandingLayout>
    );
}
