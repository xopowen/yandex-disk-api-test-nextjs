import Link from "next/link";
import {Menu, MenuProps} from 'antd'
import ROUTERS from "@/app/constans";
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export default async function Header() {
    const items = [
        getItem('menu','menu',undefined,Object.entries(ROUTERS).map((value) => {
            return getItem(value[0],value[0],<Link href={value[1]}/>)
            })
            // [
            // getItem('disk:info','disk-info',  <Link href={'/'}/> ),
            // getItem('info of app folder','info-app-folder',<Link href={'/info-app-folder'}/>),
            // getItem('load-to-disk','load-to-disk',<Link href={'/load-to-disk'}/>
            // )
            // ]
        )
    ]

    return <header>
        <div style={{position:'fixed',zIndex:100}}>
            <Menu  mode="inline"  items={items}/>
        </div>

    </header>

}