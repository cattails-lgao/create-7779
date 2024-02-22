import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import * as AntdIcons from '@ant-design/icons';
import './index.scss';
import { useMenuStore } from '@/stores/menu';

export default function SideBar() {
  const { menu, tag, setTag } = useMenuStore();
  const navigate = useNavigate();

  function generatorMenu(data) {
    return data.map((item) => {
      const val = {
        ...item,
        key: item.path,
        icon: AntdIcons[item.icon] ? AntdIcons[item.icon].render() : '',
      };

      if (item.children?.length) {
        return {
          ...val,
          children: generatorMenu(item.children),
        };
      }

      return val;
    });
    // .filter((item) => item.show);
  }

  function onClick({ key, keyPath }) {
    navigate(key);
    setTag(keyPath);
  }
  return (
    <aside className="sideBar shrink-0 overflow-x-hidden overflow-y-auto fixed">
      <Menu
        mode="inline"
        className="h-full"
        selectedKeys={tag}
        items={generatorMenu(menu)}
        onClick={onClick}
      />
    </aside>
  );
}
