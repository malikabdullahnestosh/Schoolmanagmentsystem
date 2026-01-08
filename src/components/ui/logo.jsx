import schoolLogo from '../../assets/schoolLogo.png';
export default function Logo() {
  return (
    <div className="bg-white px-4 py-5 rounded">
      <div className="flex items-center space-x-2">
        
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <img src={schoolLogo}/>
          </div>
      
        <div>
          <div className="text-[#2191BF] font-bold text-sm">The Future Grooming</div>
          <div className="text-[#2191BF] text-xs">School</div>
        </div>
      </div>
    </div>
  )
}
