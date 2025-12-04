import React from 'react';
import useAuth from '../hooks/useAuth';
import Slider from 'react-slick';
import './DashboardPage.css';

const slides = [
    { id: 1, title: "Xush kelibsiz!", desc: "Bilimingizni sinang va rivojlaning.", color: "#3498db" },
    { id: 2, title: "Yangi Topshiriqlar", desc: "Python va Scratch bo'yicha yangi testlar.", color: "#9b59b6" },
    { id: 3, title: "Musobaqa", desc: "Eng faol o'quvchilar uchun sov'galar.", color: "#e67e22" }
];

function DashboardPage() {
    const { userName } = useAuth();
    const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true };

    return (
        <div>
            <div className="page-header">
                <h1>Salom, {userName}!</h1>
                <p>Bugun nima o'rganamiz?</p>
            </div>
            <div className="slider-container" style={{ marginBottom: '2rem' }}>
                <Slider {...settings}>
                    {slides.map(s => (
                        <div key={s.id} className="slide-item" style={{ background: s.color }}>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
export default DashboardPage;