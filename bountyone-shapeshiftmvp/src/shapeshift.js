import config from './config';
import shapeshiftStarter from '@parity/shapeshift';

const shapeshift = shapeshiftStarter(config.API_KEY);

export default shapeshift;