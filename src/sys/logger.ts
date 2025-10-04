import winston from 'winston'

import config from '@/sys/config'

const {
  logger: { level },
} = config

const logger = winston.createLogger({
  level,
  format: winston.format.json(),
  defaultMeta: { service: 'insights-bff-service' },
  transports: [new winston.transports.Console()],
})

export default logger
