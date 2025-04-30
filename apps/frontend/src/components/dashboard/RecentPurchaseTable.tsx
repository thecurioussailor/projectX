import tableLogo from "../../assets/images/tableLogo.png";
import { RecentSale } from "./RecentPurchases";

const RecentPurchaseTable = ({data}: {data: RecentSale[]}) => {
  return (
    <div className="overflow-x-scroll lg:overflow-x-hidden">
        <table className="w-full min-w-max lg:min-w-full">
            <thead>
              <th className=""></th>
              <th className=""></th>
              <th className=""></th>
              <th className=""></th>
              <th className=""></th>
            </thead>
            <tbody className="overflow-x-scroll">
                {data.map((item, index) => (
                    <TableRow key={index} item={item}/>
                ))} 
            </tbody>
        </table>
    </div>
  )
}

export default RecentPurchaseTable



interface Item {
    id: string;
    amount: number;
    status: string;
    productType: string;
    createdAt: string;
    user: {
      username: string;
      profileImage: string | null;
    };
    digitalProduct?: {
      title: string;
      coverImage: string | null;
    };
    telegramPlan?: {
      name: string;
      channel: {
        channelName: string;
      };
    };
}

const TableRow = ({item}: {item: Item}) => {

    return (
        <tr className="h-20">
            <td className="md:pr-4 pr-4">
                <img src={tableLogo} width={54} height={54}/>
            </td>
            <td className="text-[#1B3155] md:pr-4 pr-2 font-semibold">{item.user.username}</td>
            <td><span className="bg-[#E7F3FE] md:mr-8 mr-4 text-[#158DF7] text-xs font-semibold rounded-full px-2 py-1">{item.productType}</span></td>
            <td className="font-semibold md:pr-8 pr-4">{item.productType === "TELEGRAM_PLAN" ? item.telegramPlan?.name : item.digitalProduct?.title}</td>
            <td className="font-semibold text-xs">{new Date(item.createdAt).toLocaleDateString('en-us', {day: 'numeric', month: 'long'})}</td>
        </tr>
    )
}