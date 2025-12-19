
export default function InputField({ label, name, value, onChange, type = "text", placeholder = "" }) {
    return (
        <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm placeholder:text-gray-200"
            />
        </div>
    );
}