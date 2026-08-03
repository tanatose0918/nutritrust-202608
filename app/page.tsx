
// Home Page Components
import HeroSection from '@/components/features/home/HeroSection';
import TrustPropositions from '@/components/features/home/TrustPropositions';
import VisitorStats from '@/components/features/home/VisitorStats';
import SurveyEarlyAccess from '@/components/features/home/SurveyEarlyAccess';
// เดี๋ยวเราค่อยๆ ทยอยสร้างแล้วเปิด Comment ทีละอันครับ

// import TrendingProducts from '@/components/features/home/TrendingProducts';
// import HealthGoals from '@/components/features/home/HealthGoals';
// import SurveyWaitlistForm from '@/components/shared/SurveyWaitlistForm';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-20 pt-6 md:pt-10 pb-16 md:pb-24">
      {/* 1. ส่วนแบนเนอร์และค้นหา */}
      <HeroSection />

      {/* 2. ส่วนสถิติจำนวนผู้ใช้งานและจำนวนการค้นหา */}
      <VisitorStats />

      {/* 3. ส่วนการ์ดจุดขาย 4 ข้อ */}
      <TrustPropositions />

      {/* 4. สินค้ายอดฮิต (รอประกอบร่าง) */}
      {/* <TrendingProducts /> */}

      {/* 5. หมวดหมู่สุขภาพ (รอประกอบร่าง) */}
      {/* <HealthGoals /> */}

      {/* 5. ฟอร์มรับอีเมล (รอประกอบร่าง) */}
      {/* <SurveyWaitlistForm /> */}
      <SurveyEarlyAccess />
    </div>
  );
}