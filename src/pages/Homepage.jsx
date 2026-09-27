import { useState, useEffect } from 'react';
import './Homepage.css';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import Pagination from '../components/Pagination.jsx';

export const THIS_WEEK = [
    { id: 1,  year: 2025, month: 'OCT', day: '20', category: 'Tech',       doors: '18:00', start: '19:00', end: '22:00', title: 'Lagos Tech Meetup', venue: 'Landmark Centre, Lagos', price: '₦5,000' },
    { id: 2,  year: 2025, month: 'OCT', day: '20', category: 'Sports',     doors: '16:30', start: '17:00', end: '18:30', title: 'Sunset Yoga on the Beach', venue: 'Tarkwa Bay', price: '₦4,000' },
    { id: 3,  year: 2025, month: 'OCT', day: '21', category: 'Music',      doors: '19:00', start: '20:00', end: '23:30', title: 'Afrobeats Night Live', venue: 'Muri Okunola Park', price: '₦12,000' },
    { id: 4,  year: 2025, month: 'OCT', day: '21', category: 'Workshops',  doors: '10:00', start: '10:30', end: '13:00', title: 'Intro to Pottery', venue: 'Nike Art Gallery', price: '₦15,000' },
    { id: 5,  year: 2025, month: 'OCT', day: '22', category: 'Tech',       doors: '09:00', start: '09:30', end: '16:00', title: 'Design Systems Workshop', venue: 'Zone Tech Park', price: '₦8,500' },
    { id: 6,  year: 2025, month: 'OCT', day: '22', category: 'Music',      doors: '18:30', start: '19:30', end: '23:00', title: 'Rooftop Jazz Session', venue: 'The Wheatbaker, Ikoyi', price: '₦18,000' },
    { id: 7,  year: 2025, month: 'OCT', day: '23', category: 'Networking', doors: '17:30', start: '18:00', end: '21:00', title: 'Startup Pitch Night', venue: 'Co-Creation Hub, Yaba', price: '₦2,000' },
    { id: 8,  year: 2025, month: 'OCT', day: '23', category: 'Arts',       doors: '18:00', start: '19:00', end: '21:30', title: 'Nollywood Classics Screening', venue: 'Filmhouse IMAX, Lekki', price: '₦6,500' },
    { id: 9,  year: 2025, month: 'OCT', day: '24', category: 'Food',       doors: '11:00', start: '12:00', end: '20:00', title: 'Street Food Festival', venue: 'Victoria Island Waterfront', price: '₦3,500' },
    { id: 10, year: 2025, month: 'OCT', day: '24', category: 'Comedy',     doors: '18:30', start: '19:30', end: '22:00', title: 'Comedy Open Mic', venue: 'The Terrace, VI', price: '₦5,000' },
    { id: 11, year: 2025, month: 'OCT', day: '25', category: 'Tech',       doors: '17:00', start: '17:30', end: '20:30', title: 'AI & Product Meetup', venue: 'Microsoft ADC, Ikoyi', price: '₦4,500' },
    { id: 12, year: 2025, month: 'OCT', day: '25', category: 'Music',      doors: '19:00', start: '20:00', end: '23:00', title: 'Vinyl & Wine Evening', venue: 'Jazzhole, Ikoyi', price: '₦14,000' },
    { id: 13, year: 2025, month: 'OCT', day: '26', category: 'Community',  doors: '07:00', start: '07:30', end: '13:00', title: 'Weekend Farmers Market', venue: 'Lekki Phase 1', price: '₦1,000' },
    { id: 14, year: 2025, month: 'OCT', day: '26', category: 'Workshops',  doors: '08:00', start: '08:30', end: '11:30', title: 'Photography Walk: Lagos Island', venue: 'Freedom Park', price: '₦7,500' },
    { id: 15, year: 2025, month: 'OCT', day: '27', category: 'Food',       doors: '11:00', start: '11:30', end: '15:00', title: 'Brunch & Board Games', venue: 'Bogobiri House', price: '₦9,000' },
    { id: 16, year: 2025, month: 'OCT', day: '27', category: 'Music',      doors: '17:00', start: '17:30', end: '19:30', title: 'Afro-Fusion Dance Class', venue: 'Ikoyi Community Centre', price: '₦6,000' },
    { id: 17, year: 2025, month: 'OCT', day: '28', category: 'Arts',       doors: '18:00', start: '18:30', end: '20:30', title: 'Book Club: African Fiction', venue: 'Patabah Books, Surulere', price: '₦2,500' },
    { id: 18, year: 2025, month: 'OCT', day: '29', category: 'Arts',       doors: '18:00', start: '19:00', end: '21:30', title: 'Indie Film Night', venue: 'Genesis Cinema, Yaba', price: '₦5,500' },
    { id: 19, year: 2025, month: 'OCT', day: '30', category: 'Workshops',  doors: '18:30', start: '19:00', end: '21:30', title: 'Cocktail Mixology Class', venue: 'The Moorhouse, Ikoyi', price: '₦22,000' },
    { id: 20, year: 2025, month: 'OCT', day: '31', category: 'Music',      doors: '20:00', start: '21:00', end: '01:00', title: 'Halloween Costume Party', venue: 'Hard Rock Cafe, VI', price: '₦15,000' },
];

export const ALL_EVENTS = [
    { id: 21,  year: 2025, month: 'NOV', day: '02', category: 'Networking', doors: '07:30', start: '08:00', end: '10:30', title: 'Founders Breakfast', venue: 'Ikoyi Club', price: '₦3,000' },
    { id: 22,  year: 2025, month: 'NOV', day: '03', category: 'Tech',       doors: '09:00', start: '09:30', end: '17:00', title: 'Lagos Blockchain Summit', venue: 'Eko Convention Centre', price: '₦25,000' },
    { id: 23,  year: 2025, month: 'NOV', day: '04', category: 'Arts',       doors: '18:30', start: '19:00', end: '21:30', title: 'Open Mic Poetry Night', venue: 'Terra Kulture', price: '₦4,000' },
    { id: 24,  year: 2025, month: 'NOV', day: '05', category: 'Tech',       doors: '09:00', start: '09:30', end: '16:30', title: 'UX Research Bootcamp', venue: 'Zone Tech Park', price: '₦18,000' },
    { id: 25,  year: 2025, month: 'NOV', day: '06', category: 'Music',      doors: '19:00', start: '20:00', end: '23:30', title: 'Salsa Under the Stars', venue: 'The Lagoon, VI', price: '₦8,000' },
    { id: 26,  year: 2025, month: 'NOV', day: '07', category: 'Arts',       doors: '18:00', start: '18:30', end: '21:00', title: 'Art Exhibition Opening', venue: 'Rele Gallery, Ikoyi', price: '₦5,000' },
    { id: 27,  year: 2025, month: 'NOV', day: '08', category: 'Comedy',     doors: '19:00', start: '20:00', end: '22:30', title: 'Comedy Under the Stars', venue: 'Freedom Park', price: '₦7,000' },
    { id: 28,  year: 2025, month: 'NOV', day: '09', category: 'Networking', doors: '18:30', start: '19:00', end: '22:30', title: 'Fintech Founders Dinner', venue: 'The Wheatbaker, Ikoyi', price: '₦35,000' },
    { id: 29,  year: 2025, month: 'NOV', day: '10', category: 'Community',  doors: '10:00', start: '10:30', end: '15:00', title: 'Kids Science Fair', venue: 'National Theatre, Iganmu', price: '₦2,000' },
    { id: 30,  year: 2025, month: 'NOV', day: '11', category: 'Sports',     doors: '06:00', start: '06:30', end: '08:30', title: 'Sunrise Bootcamp', venue: 'Lekki Conservation Centre', price: '₦6,000' },
    { id: 31,  year: 2025, month: 'NOV', day: '12', category: 'Food',       doors: '18:30', start: '19:00', end: '21:30', title: 'Wine Tasting Masterclass', venue: 'La Casa, Ikoyi', price: '₦28,000' },
    { id: 32,  year: 2025, month: 'NOV', day: '13', category: 'Workshops',  doors: '17:30', start: '18:00', end: '20:30', title: 'Afrobeat Drumming Workshop', venue: 'Muson Centre', price: '₦9,500' },
    { id: 33,  year: 2025, month: 'NOV', day: '14', category: 'Tech',       doors: '09:00', start: '10:00', end: '17:00', title: 'Tech Career Fair', venue: 'Landmark Centre, Lagos', price: '₦1,500' },
    { id: 34,  year: 2025, month: 'NOV', day: '15', category: 'Tech',       doors: '08:30', start: '09:00', end: '18:00', title: 'Product Africa Summit', venue: 'Eko Convention Centre', price: '₦20,000' },
    { id: 35,  year: 2025, month: 'NOV', day: '16', category: 'Community',  doors: '08:00', start: '08:30', end: '14:00', title: 'Beach Cleanup & BBQ', venue: 'Oniru Beach', price: '₦3,000' },
    { id: 36,  year: 2025, month: 'NOV', day: '17', category: 'Arts',       doors: '18:00', start: '19:00', end: '21:30', title: 'Film Screening: New Nollywood', venue: 'Filmhouse IMAX, Lekki', price: '₦6,500' },
    { id: 37,  year: 2025, month: 'NOV', day: '18', category: 'Workshops',  doors: '10:00', start: '10:30', end: '13:30', title: 'Creative Writing Workshop', venue: 'Patabah Books, Surulere', price: '₦12,000' },
    { id: 38,  year: 2025, month: 'NOV', day: '19', category: 'Food',       doors: '18:00', start: '18:30', end: '21:00', title: 'Sushi Making Class', venue: 'Nobu, Victoria Island', price: '₦30,000' },
    { id: 39,  year: 2025, month: 'NOV', day: '20', category: 'Networking', doors: '17:00', start: '17:30', end: '20:00', title: 'Startup Legal Clinic', venue: 'Co-Creation Hub, Yaba', price: '₦5,000' },
    { id: 40,  year: 2025, month: 'NOV', day: '21', category: 'Music',      doors: '19:00', start: '20:00', end: '23:00', title: 'Jazz on the Lagoon', venue: 'Terra Kulture', price: '₦10,000' },
    { id: 41,  year: 2025, month: 'NOV', day: '22', category: 'Community',  doors: '10:00', start: '11:00', end: '18:00', title: 'Fashion Pop-Up Market', venue: 'The Palms, Lekki', price: '₦2,000' },
    { id: 42,  year: 2025, month: 'NOV', day: '23', category: 'Networking', doors: '18:00', start: '18:30', end: '21:00', title: 'Podcast Live Recording', venue: 'Ikoyi Community Centre', price: '₦4,500' },
    { id: 43,  year: 2025, month: 'NOV', day: '24', category: 'Tech',       doors: '09:00', start: '09:30', end: '16:00', title: 'Coding for Beginners', venue: 'Microsoft ADC, Ikoyi', price: '₦8,000' },
    { id: 44,  year: 2025, month: 'NOV', day: '25', category: 'Music',      doors: '20:00', start: '21:00', end: '02:00', title: 'Afro-House Dance Party', venue: 'Hard Rock Cafe, VI', price: '₦11,000' },
    { id: 45,  year: 2025, month: 'NOV', day: '26', category: 'Community',  doors: '09:00', start: '10:00', end: '16:00', title: 'Sustainable Living Fair', venue: 'Lekki Conservation Centre', price: '₦3,500' },
    { id: 46,  year: 2025, month: 'NOV', day: '27', category: 'Workshops',  doors: '18:00', start: '18:30', end: '21:00', title: 'Cocktail & Canvas Night', venue: 'The Moorhouse, Ikoyi', price: '₦19,000' },
    { id: 47,  year: 2025, month: 'NOV', day: '28', category: 'Workshops',  doors: '10:00', start: '10:30', end: '13:00', title: 'Bonsai Workshop', venue: 'Nike Art Gallery', price: '₦13,000' },
    { id: 48,  year: 2025, month: 'NOV', day: '29', category: 'Food',       doors: '12:00', start: '13:00', end: '21:00', title: 'Afro-Caribbean Food Festival', venue: 'Muri Okunola Park', price: '₦5,000' },
    { id: 49,  year: 2025, month: 'NOV', day: '30', category: 'Networking', doors: '18:30', start: '19:00', end: '22:00', title: 'End of Month Social', venue: 'Bogobiri House', price: '₦6,000' },
    { id: 50,  year: 2025, month: 'DEC', day: '01', category: 'Music',      doors: '18:00', start: '19:00', end: '23:00', title: 'December Kickoff Concert', venue: 'Eko Atlantic', price: '₦22,000' },
    { id: 51,  year: 2025, month: 'DEC', day: '02', category: 'Networking', doors: '07:30', start: '08:00', end: '11:00', title: 'Investor Networking Breakfast', venue: 'Ikoyi Club', price: '₦15,000' },
    { id: 52,  year: 2025, month: 'DEC', day: '03', category: 'Community',  doors: '10:00', start: '11:00', end: '17:00', title: 'Handmade Holiday Market', venue: 'The Palms, Lekki', price: '₦1,500' },
    { id: 53,  year: 2025, month: 'DEC', day: '04', category: 'Workshops',  doors: '17:00', start: '17:30', end: '20:00', title: 'Christmas Wreath Workshop', venue: 'The Terrace, VI', price: '₦12,000' },
    { id: 54,  year: 2025, month: 'DEC', day: '05', category: 'Comedy',     doors: '19:00', start: '20:00', end: '22:30', title: 'Stand-Up Comedy Special', venue: 'Muson Centre', price: '₦18,000' },
    { id: 55,  year: 2025, month: 'DEC', day: '06', category: 'Music',      doors: '11:00', start: '12:00', end: '15:00', title: 'Holiday Jazz Brunch', venue: 'The Wheatbaker, Ikoyi', price: '₦25,000' },
    { id: 56,  year: 2025, month: 'DEC', day: '07', category: 'Food',       doors: '10:00', start: '10:30', end: '13:30', title: 'Gingerbread Baking Class', venue: 'La Casa, Ikoyi', price: '₦14,000' },
    { id: 57,  year: 2025, month: 'DEC', day: '08', category: 'Music',      doors: '18:30', start: '19:00', end: '21:00', title: 'Carols by Candlelight', venue: 'Cathedral Church, Marina', price: '₦5,000' },
    { id: 58,  year: 2025, month: 'DEC', day: '09', category: 'Tech',       doors: '18:00', start: '18:30', end: '20:30', title: 'Coding Bootcamp Info Session', venue: 'Zone Tech Park', price: '₦2,000' },
    { id: 59,  year: 2025, month: 'DEC', day: '10', category: 'Music',      doors: '20:00', start: '21:00', end: '01:00', title: 'Vinyl Christmas Party', venue: 'Jazzhole, Ikoyi', price: '₦16,000' },
    { id: 60,  year: 2025, month: 'DEC', day: '11', category: 'Community',  doors: '10:00', start: '10:30', end: '14:00', title: 'Kids Holiday Craft Day', venue: 'National Theatre, Iganmu', price: '₦4,000' },
    { id: 61,  year: 2025, month: 'DEC', day: '12', category: 'Arts',       doors: '18:30', start: '19:30', end: '22:00', title: 'Rooftop Cinema Night', venue: 'The Lagoon, VI', price: '₦9,000' },
    { id: 62,  year: 2025, month: 'DEC', day: '13', category: 'Music',      doors: '19:00', start: '20:00', end: '00:00', title: 'Afrobeat Christmas Concert', venue: 'Eko Convention Centre', price: '₦30,000' },
    { id: 63,  year: 2025, month: 'DEC', day: '14', category: 'Workshops',  doors: '18:00', start: '18:30', end: '21:00', title: 'Holiday Sip & Paint', venue: 'Bogobiri House', price: '₦17,000' },
    { id: 64,  year: 2025, month: 'DEC', day: '15', category: 'Networking', doors: '18:30', start: '19:00', end: '22:00', title: 'Founders Christmas Mixer', venue: 'Co-Creation Hub, Yaba', price: '₦10,000' },
    { id: 65,  year: 2025, month: 'DEC', day: '16', category: 'Food',       doors: '12:00', start: '13:00', end: '20:00', title: 'Christmas Food Fair', venue: 'Victoria Island Waterfront', price: '₦3,000' },
    { id: 66,  year: 2025, month: 'DEC', day: '17', category: 'Music',      doors: '20:00', start: '21:00', end: '02:00', title: 'Festive Dance Party', venue: 'Hard Rock Cafe, VI', price: '₦13,000' },
    { id: 67,  year: 2025, month: 'DEC', day: '18', category: 'Workshops',  doors: '15:00', start: '15:30', end: '18:00', title: 'Holiday Photography Walk', venue: 'Freedom Park', price: '₦8,500' },
    { id: 68,  year: 2025, month: 'DEC', day: '19', category: 'Tech',       doors: '17:30', start: '18:00', end: '21:00', title: 'Tech 2026 Predictions Panel', venue: 'Microsoft ADC, Ikoyi', price: '₦6,000' },
    { id: 69,  year: 2025, month: 'DEC', day: '20', category: 'Networking', doors: '18:00', start: '19:00', end: '23:30', title: 'End of Year Gala', venue: 'Eko Hotels & Suites', price: '₦45,000' },
    { id: 70,  year: 2025, month: 'DEC', day: '21', category: 'Music',      doors: '19:30', start: '20:30', end: '23:30', title: 'Karaoke Christmas Night', venue: 'The Terrace, VI', price: '₦7,000' },
    { id: 71,  year: 2025, month: 'DEC', day: '22', category: 'Arts',       doors: '10:00', start: '11:00', end: '17:00', title: 'Holiday Book Fair', venue: 'Patabah Books, Surulere', price: '₦2,500' },
    { id: 72,  year: 2025, month: 'DEC', day: '23', category: 'Music',      doors: '20:00', start: '21:00', end: '01:00', title: 'Christmas Eve Eve Party', venue: 'Muri Okunola Park', price: '₦11,000' },
    { id: 73,  year: 2025, month: 'DEC', day: '27', category: 'Sports',     doors: '08:00', start: '08:30', end: '10:30', title: 'Post-Christmas Detox Yoga', venue: 'Lekki Conservation Centre', price: '₦5,500' },
    { id: 74,  year: 2025, month: 'DEC', day: '28', category: 'Workshops',  doors: '10:00', start: '10:30', end: '13:00', title: 'New Year Reset Workshop', venue: 'Zone Tech Park', price: '₦9,000' },
    { id: 75,  year: 2025, month: 'DEC', day: '29', category: 'Music',      doors: '20:00', start: '21:00', end: '02:00', title: 'Afrobeats Countdown Warm-Up', venue: 'Eko Atlantic', price: '₦20,000' },
    { id: 76,  year: 2025, month: 'DEC', day: '30', category: 'Music',      doors: '20:30', start: '21:30', end: '02:00', title: 'Pre-New Year Rooftop Party', venue: 'The Wheatbaker, Ikoyi', price: '₦28,000' },
    { id: 77,  year: 2025, month: 'DEC', day: '31', category: 'Music',      doors: '20:00', start: '22:00', end: '04:00', title: 'New Year\'s Eve Countdown', venue: 'Eko Hotels & Suites', price: '₦50,000' },
    { id: 78,  year: 2026, month: 'JAN', day: '02', category: 'Workshops',  doors: '10:00', start: '10:30', end: '13:30', title: 'New Year Vision Board Workshop', venue: 'Bogobiri House', price: '₦8,000' },
    { id: 79,  year: 2026, month: 'JAN', day: '03', category: 'Sports',     doors: '06:00', start: '06:30', end: '08:30', title: 'Fitness Bootcamp Kickoff', venue: 'Oniru Beach', price: '₦6,500' },
    { id: 80,  year: 2026, month: 'JAN', day: '04', category: 'Tech',       doors: '17:30', start: '18:00', end: '20:30', title: '2026 Tech Trends Panel', venue: 'Co-Creation Hub, Yaba', price: '₦4,000' },
    { id: 81,  year: 2026, month: 'JAN', day: '05', category: 'Music',      doors: '19:00', start: '20:00', end: '23:00', title: 'January Jazz Nights', venue: 'Terra Kulture', price: '₦12,000' },
    { id: 82,  year: 2026, month: 'JAN', day: '06', category: 'Workshops',  doors: '10:00', start: '10:30', end: '14:00', title: 'Creative Business Workshop', venue: 'Nike Art Gallery', price: '₦15,000' },
    { id: 83,  year: 2026, month: 'JAN', day: '07', category: 'Tech',       doors: '17:00', start: '17:30', end: '21:00', title: 'Startup Demo Day', venue: 'Landmark Centre, Lagos', price: '₦3,000' },
    { id: 84,  year: 2026, month: 'JAN', day: '08', category: 'Sports',     doors: '08:00', start: '09:00', end: '17:00', title: 'Wellness Reset Retreat', venue: 'Lekki Conservation Centre', price: '₦22,000' },
    { id: 85,  year: 2026, month: 'JAN', day: '09', category: 'Workshops',  doors: '09:00', start: '09:30', end: '16:00', title: 'Photography Masterclass', venue: 'Rele Gallery, Ikoyi', price: '₦18,000' },
    { id: 86,  year: 2026, month: 'JAN', day: '10', category: 'Food',       doors: '11:00', start: '12:00', end: '20:00', title: 'Food Truck Festival', venue: 'Victoria Island Waterfront', price: '₦2,500' },
    { id: 87,  year: 2026, month: 'JAN', day: '11', category: 'Tech',       doors: '09:00', start: '09:30', end: '16:00', title: 'AI for Beginners', venue: 'Microsoft ADC, Ikoyi', price: '₦7,000' },
    { id: 88,  year: 2026, month: 'JAN', day: '12', category: 'Comedy',     doors: '18:30', start: '19:30', end: '22:00', title: 'Open Mic Comedy Night', venue: 'The Terrace, VI', price: '₦5,000' },
    { id: 89,  year: 2026, month: 'JAN', day: '13', category: 'Food',       doors: '18:30', start: '19:00', end: '21:30', title: 'Wine & Cheese Tasting', venue: 'La Casa, Ikoyi', price: '₦20,000' },
    { id: 90,  year: 2026, month: 'JAN', day: '14', category: 'Music',      doors: '17:30', start: '18:00', end: '20:30', title: 'Afrobeat Dance Intensive', venue: 'Muson Centre', price: '₦10,000' },
    { id: 91,  year: 2026, month: 'JAN', day: '15', category: 'Arts',       doors: '18:00', start: '18:30', end: '20:30', title: 'Book Club: New Year Reads', venue: 'Patabah Books, Surulere', price: '₦2,000' },
    { id: 92,  year: 2026, month: 'JAN', day: '16', category: 'Arts',       doors: '18:00', start: '19:00', end: '21:30', title: 'Film Screening: African Cinema', venue: 'Filmhouse IMAX, Lekki', price: '₦6,000' },
    { id: 93,  year: 2026, month: 'JAN', day: '17', category: 'Workshops',  doors: '10:00', start: '10:30', end: '13:00', title: 'Coffee Brewing Workshop', venue: 'Bogobiri House', price: '₦11,000' },
    { id: 94,  year: 2026, month: 'JAN', day: '18', category: 'Tech',       doors: '17:30', start: '18:00', end: '20:30', title: 'Product Design Meetup', venue: 'Zone Tech Park', price: '₦4,500' },
    { id: 95,  year: 2026, month: 'JAN', day: '19', category: 'Music',      doors: '18:30', start: '19:30', end: '23:00', title: 'Rooftop Sunset Party', venue: 'The Lagoon, VI', price: '₦14,000' },
    { id: 96,  year: 2026, month: 'JAN', day: '20', category: 'Networking', doors: '09:00', start: '09:30', end: '16:00', title: 'Business Plan Bootcamp', venue: 'Ikoyi Club', price: '₦25,000' },
    { id: 97,  year: 2026, month: 'JAN', day: '21', category: 'Music',      doors: '19:00', start: '20:00', end: '23:00', title: 'Live Band Night', venue: 'Jazzhole, Ikoyi', price: '₦13,000' },
    { id: 98,  year: 2026, month: 'JAN', day: '22', category: 'Arts',       doors: '18:00', start: '18:30', end: '21:00', title: 'Art & Wine Evening', venue: 'Rele Gallery, Ikoyi', price: '₦16,000' },
    { id: 99,  year: 2026, month: 'JAN', day: '23', category: 'Networking', doors: '17:30', start: '18:00', end: '20:30', title: 'Tech Founders Fireside Chat', venue: 'Co-Creation Hub, Yaba', price: '₦5,000' },
    { id: 100, year: 2026, month: 'JAN', day: '24', category: 'Community',  doors: '11:00', start: '12:00', end: '17:00', title: 'Community Potluck Picnic', venue: 'Muri Okunola Park', price: '₦3,000' },
];

const CATEGORIES = ['All', 'Music', 'Tech', 'Workshops', 'Comedy', 'Networking', 'Food', 'Arts', 'Sports', 'Community'];



function SearchIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function DateStub({ year, month, day }) {
    return (
        <div className="date-stub" aria-hidden="true">
            <span className="date-stub-month">{month}</span>
            <span className="date-stub-day">{day}</span>
            {year && <span className="date-stub-year">{year}</span>}
        </div>
    );
}

function EventCard({ event }) {
    return (
        <a href={`/events/${event.id}`} className="event-card">
            <DateStub month={event.month} day={event.day} year={event.year} />
            <div className="event-card-body">
                <h3>{event.title}</h3>
                <p className="event-card-venue"><PinIcon /> {event.venue}</p>
            </div>
            <span className="event-card-price">{event.price}</span>
        </a>
    );
}


export function formatEventDate(event) {
  return `${event.month} ${event.day}, ${event.year}`;
}


export default function Homepage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');

    const EVENTS_PER_PAGE = 9;
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(ALL_EVENTS.length / EVENTS_PER_PAGE);
    const pageEvents = ALL_EVENTS.slice(
        (page - 1) * EVENTS_PER_PAGE,
        page * EVENTS_PER_PAGE
    );



    const goToPage = (n) => {
        const clamped = Math.min(Math.max(n, 1), totalPages);
        setPage(clamped);
    };


    useEffect(() => {
        const el = document.getElementById('explore');
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - 80; // offset for sticky header
        window.scrollTo({ top: y, behavior: 'smooth' });
    }, [page]);

    return (
        <div className="page">
            <Header />

            <section className="hero">
                <div className="hero-copy">
                    <h1>Find something worth leaving the house for.</h1>
                    <p>Live music, workshops, and meetups happening near you — book in under a minute, no account required.</p>

                    <form className="search" onSubmit={(e) => e.preventDefault()}>
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search events, artists, or venues"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search events"
                        />
                        <button type="submit">Search</button>
                    </form>

                    <div className="chips">
                        {CATEGORIES.map((c) => (
                            <button
                                type="button"
                                key={c}
                                className={c === category ? 'chip chip-active' : 'chip'}
                                onClick={() => setCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <h2>Happening this week</h2>
                    <a href="/events?range=week">See all →</a>
                </div>
                <div className="rail">
                    {THIS_WEEK.map((ev) => <EventCard event={ev} key={ev.id} />)}
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <h2>Explore more events</h2>
                    <a href="/events">See all →</a>
                    <span className="section-meta">
                        Page {page} of {totalPages}
                    </span>
                </div>
                <div className="grid">
                    {pageEvents.map((ev) => <EventCard event={ev} key={ev.id} />)}
                </div>

                <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
            </section>

            <Footer />
        </div>
    );
}