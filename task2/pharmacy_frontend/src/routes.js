import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import Account from './pages/Account/Account';
import UserInfo from './pages/User/UserInfo';
import UserEdit from './pages/User/UserEdit';
import UserList from './pages/User/UserList';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Logs from './pages/Systems/Logs/Logs';
import Dashboard from './pages/Dashboard/Dashboard';
import EmailTemplateList from './pages/Templates/Email-Templates/EmailTemplateList';
import EmailTemplateCreate from './pages/Templates/Email-Templates/EmailTemplateCreate';
import EmailTemplateEdit from './pages/Templates/Email-Templates/EmailTemplateEdit';
import CommonSettings from './pages/Systems/CommonSettings/CommonSettings';
import UpdateSystem from './pages/Systems/UpdateSystem/UpdateSystem';
import SettingsExampl from './pages/Settings/SettingsExampl';
import UserAdd from './pages/User/UserAdd';
import EmailHistoryList from './pages/Templates/Email-Hstory/EmailHistoryList';
import FeedBackList from './pages/FeedBacks/FeedBackList';
import FeedBackEdit from './pages/FeedBacks/FeedBackEdit';
import ConfigurationKeysList from './pages/ConfigurationKeys/ConfigurationKeysList';
import ConfigurationKeysAdd from './pages/ConfigurationKeys/ConfigurationKeysAdd';
import ConfigurationKeysEdit from './pages/ConfigurationKeys/ConfigurationKeysEdit';
import AppLogs from './pages/AppWork/AppLogs';
import AppStatistics from './pages/AppStatistics/AppStatistics';
import AppStatisticsEventsList from './pages/AppStatistics/AppStatisticsEventsList';
import AppStatisticsEventsAdd from './pages/AppStatistics/AppStatisticsEventsAdd';
import AppStatisticsEventsEdit from './pages/AppStatistics/AppStatisticsEventsEdit';
import ProjectsList from './pages/Projects/ProjectsList';
import ProjectEdit from './pages/Projects/ProjectEdit';
import ProjectAdd from './pages/Projects/ProjectAdd';
import LinkEdit from './pages/Links/LinkEdit';
import LinkAdd from './pages/Links/LinkAdd';
import LinksList from './pages/Links/LinksList';
import LinkInfo from './pages/Links/LinkInfo';
import DeletedLinksList from './pages/Links/DeletedLinksList';
import MedicineTypeList from './pages/MedicineTypes/MedicineTypeList';
import MedicineTypeAdd from './pages/MedicineTypes/MedicineTypeAdd';
import MedicineTypeInfo from './pages/MedicineTypes/MedicineTypeInfo';
import MedicineTypeEdit from './pages/MedicineTypes/MedicineTypeEdit';
import MedicineInfo from './pages/Medicine/MedicineInfo';
import MedicineEdit from './pages/Medicine/MedicineEdit';
import MedicineAdd from './pages/Medicine/MedicineAdd';
import MedicineList from './pages/Medicine/MedicineList';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'dashboard', element: <Dashboard /> },

      { path: 'user/:id', element: <UserInfo /> },
      { path: 'user/edit/:id', element: <UserEdit /> },
      { path: 'user/add', element: <UserAdd /> },
      { path: 'users', element: <UserList /> },

      { path: 'medicine/types/:id', element: <MedicineTypeInfo /> },
      { path: 'medicine/types/edit/:id', element: <MedicineTypeEdit /> },
      { path: 'medicine/types/add', element: <MedicineTypeAdd /> },
      { path: 'medicine/types', element: <MedicineTypeList /> },

      { path: 'medicine/:id', element: <MedicineInfo /> },
      { path: 'medicine/edit/:id', element: <MedicineEdit /> },
      { path: 'medicine/add', element: <MedicineAdd /> },
      { path: 'medicine', element: <MedicineList /> },

      { path: 'feedbacks/edit/:id', element: <FeedBackEdit /> },
      { path: 'feedbacks', element: <FeedBackList /> },

      { path: 'email-templates', element: <EmailTemplateList /> },
      { path: 'email-history', element: <EmailHistoryList /> },
      { path: 'email-templates/create', element: <EmailTemplateCreate /> },
      { path: 'email-templates/edit/:id', element: <EmailTemplateEdit /> },

      { path: 'app-logs', element: <AppLogs /> },

      { path: 'app-statistics', element: <AppStatistics /> },
      { path: 'app-statistics/events', element: <AppStatisticsEventsList /> },
      {
        path: 'app-statistics/events/add',
        element: <AppStatisticsEventsAdd />
      },
      {
        path: 'app-statistics/events/edit/:id',
        element: <AppStatisticsEventsEdit />
      },

      { path: 'logs', element: <Logs /> },
      { path: 'common-settings', element: <CommonSettings /> },
      { path: 'update-system', element: <UpdateSystem /> },

      { path: 'settings', element: <SettingsExampl /> },

      { path: 'configuration/keys', element: <ConfigurationKeysList /> },
      { path: 'configuration/keys/add', element: <ConfigurationKeysAdd /> },
      {
        path: 'configuration/keys/edit/:id',
        element: <ConfigurationKeysEdit />
      },

      { path: 'projects/edit/:id', element: <ProjectEdit /> },
      { path: 'projects/add', element: <ProjectAdd /> },
      { path: 'projects', element: <ProjectsList /> },

      { path: 'unpublished/links/', element: <DeletedLinksList /> },
      { path: 'links/:id', element: <LinkInfo /> },
      { path: 'links/edit/:id', element: <LinkEdit /> },
      { path: 'links/add', element: <LinkAdd /> },
      { path: 'links', element: <LinksList /> },

      { path: '', element: <Navigate to="/app/users" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/users" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
