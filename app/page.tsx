import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import { GrTransaction } from "react-icons/gr";

export default function Home() {
  return (
    <div className="mt-10 flex flex-col justify-center">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="mt-10 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card>
          <CardBody>
            <div className="flex gap-2 items-center">
              <Link
                href="/transaction_history"
                className="p-1 rounded-lg bg-gray-200 scale-90 hover:scale-100 transition-all"
              >
                <GrTransaction className="text-default-500" />
              </Link>
              <p>Transaksi</p>
            </div>
            <div className="flex flex-col mt-4">
              <p className="text-sm text-default-500">Jumlah transaksi</p>
              <p>12</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody></CardBody>
        </Card>
        <Card>
          <CardBody></CardBody>
        </Card>
        <Card>
          <CardBody></CardBody>
        </Card>
      </div>
    </div>
  );
}
