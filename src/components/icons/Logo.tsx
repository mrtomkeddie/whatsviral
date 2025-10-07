
import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center justify-center h-10 w-10" aria-label="WhatsViral logo">
      <Image
        src="/wvlogo.png"
        alt="WhatsViral logo"
        width={36}
        height={36}
        priority
        className="h-9 w-9"
      />
    </div>
  );
}
