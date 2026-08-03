'use client';

export default function SurveyEarlyAccess() {
    const handleSurveyClick = () => {
        window.open('https://forms.gle/A5wbW599VsM2CziQ9', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white font-sans text-gray-900">

            {/* Survey & Early-Access Section (MVP Goal) */}
            <section className="px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto w-full">
                <div className="bg-green-50 rounded-3xl p-10 border border-green-100 shadow-sm">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">ช่วยเราสร้างแพลตฟอร์มข้อมูลโภชนาการที่คนไทยไว้วางใจ</h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
                        NutriTrust อยู่ระหว่างการพัฒนา ความคิดเห็นของคุณจะช่วยให้เราสร้างแพลตฟอร์มที่ตอบโจทย์ผู้ใช้งานจริง
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button
                            onClick={handleSurveyClick}
                            className="w-full sm:w-auto bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-green-800 transition shadow-md cursor-pointer"
                        >
                            ทำแบบสำรวจ (5 นาที)
                        </button>

                        {/* <button className="w-full sm:w-auto bg-white text-green-700 border-2 border-green-700 px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-green-50 transition shadow-sm cursor-pointer">
                            เข้าร่วมทดลองใช้งาน
                        </button> */}
                    </div>
                </div>
            </section>

        </div>
    );
}