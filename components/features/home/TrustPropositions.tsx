import { ShieldCheck, Layers, Tag, BookOpen } from 'lucide-react';

export default function TrustPropositions() {
    const cards = [
        {
            icon: <ShieldCheck size={28} />,
            title: "ข้อมูลเป็นกลาง",
            desc: "เปรียบเทียบข้อมูลจากหลายแหล่ง ไม่ได้อ้างอิงเฉพาะข้อมูลจากผู้ขาย"
        },
        {
            icon: <Layers size={28} />,
            title: "เปรียบเทียบส่วนประกอบ",
            desc: "ดูปริมาณสารสำคัญ รูปแบบสาร และข้อมูลที่ควรรู้ก่อนตัดสินใจ"
        },
        {
            icon: <Tag size={28} />,
            title: "เปรียบเทียบราคา",
            desc: "ตรวจสอบราคาจากหลายร้านค้าและดูแนวโน้มราคาในอดีต"
        },
        {
            icon: <BookOpen size={28} />,
            title: "ข้อมูลวิทยาศาสตร์ที่เข้าใจง่าย",
            desc: "สรุปประโยชน์ หลักฐานสนับสนุน และข้อควรระวังด้วยภาษาที่อ่านง่าย"
        }
    ];

    return (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition duration-300 group">
                        <div className="w-14 h-14 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-100 group-hover:scale-110 transition-transform">
                            {card.icon}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-3">{card.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}