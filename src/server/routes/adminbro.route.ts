import AdminBro from 'admin-bro';
import { emailEmailTypeChoices } from '../../server/utils/constants/fieldChoices';
import { Email } from 'data/models';


const initializeAdminBroRoutes = () =>
  new AdminBro({
    rootPath: '/api/' + process.env.API_VERSION + '/emailAdmin',
    resources: [
    {
    resource: Email,
    options: {
      parent: {
        name: 'Database',
        icon: 'Api',
      },
      listProperties: [
        'id',
        'email',
        'emailType',
        'message',
        'subject',
        'createdAt',
      ],
      properties: {
        emailType: {
          availableValues: emailEmailTypeChoices.map((emailType) => ({
            value: emailType,
            label: emailType.toUpperCase(),
            })),
        },
      },
    },
  },
    ],
    branding: {
      companyName: 'Database dashboard',
      softwareBrothers: false,
      logo: false
    },
  });

export default initializeAdminBroRoutes;
