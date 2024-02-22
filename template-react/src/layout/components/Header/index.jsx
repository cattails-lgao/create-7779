import { useNavigate } from 'react-router-dom';
import { Avatar, ColorPicker, Dropdown } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { FullscreenOutlined, UserOutlined } from '@ant-design/icons';
import './index.scss';
import Logo from '@/assets/react.svg';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import { useMenuStore } from '@/stores/menu';

const items = [
  {
    key: 'out',
    label: '退出登录',
  },
];

export default function Header() {
  const userInfo = useUserStore(useShallow((store) => store.userInfo));
  const setTag = useMenuStore(useShallow((store) => store.setTag));
  const { colorPrimary, setColorPrimary } = useThemeStore(
    useShallow((store) => store)
  );

  const navigate = useNavigate();

  function onChangeComplete(value) {
    const { r, g, b, a } = value.toRgb();
    setColorPrimary(`rgba(${r}, ${g}, ${b}, ${a})`);
  }

  const itemsFnMap = {
    home: () => navigate('/'),
    out: () => navigate('/login'),
  };

  function onClick({ key }) {
    itemsFnMap[key]();
  }

  return (
    <div className="header w-full flex items-center px-4 box-border shadow shrink-0 fixed z-10 bg-white">
      <div
        className="h-10 flex items-center justify-center shrink-s mr-4 cursor-pointer"
        onClick={() => {
          setTag([]);
          onClick({ key: 'home' });
        }}
      >
        <img className="h-full w-10" src={Logo} alt="" />
        <span className="text-base ml-4">Hello World</span>
      </div>
      <div className="flex-1 h-full flex justify-end items-center">
        <FullscreenOutlined className="mr-4 cursor-pointer" />
        <ColorPicker
          className="mr-4"
          defaultValue={colorPrimary}
          onChangeComplete={onChangeComplete}
        />
        <Avatar className="mr-4 " size={32} icon={<UserOutlined />} />
        <Dropdown menu={{ items, onClick }} placement="bottom">
          <span className="text-xs cursor-pointer">
            {userInfo?.name || '未知'}
          </span>
        </Dropdown>
      </div>
    </div>
  );
}
