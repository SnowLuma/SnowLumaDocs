import { openapi } from '@/lib/openapi';
import { createAPIPage } from 'fumadocs-openapi/ui';

// `<APIPage>` renders one OpenAPI operation as a full page (request /
// response examples, parameter table, try-it widget). The route
// handler decides whether to render this or the MDX body based on
// `page.type === 'openapi'`.
export const APIPage = createAPIPage(openapi);
