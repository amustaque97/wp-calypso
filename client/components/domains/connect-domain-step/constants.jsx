export const modeType = {
	NAME_SERVERS: 'suggested',
	A_RECORDS: 'advanced',
	DONE: 'done',
};

export const stepType = {
	START: 'start_setup',
	LOG_IN_TO_PROVIDER: 'log_in_to_provider',
	UPDATE_NAME_SERVERS: 'update_name_servers',
	UPDATE_A_RECORDS: 'update_a_records',
	CONNECTED: 'connected',
	VERIFYING: 'verifying',
};

export const defaultDomainSetupInfo = {
	data: {
		default_ip_addresses: [ '192.0.78.24', '192.0.78.25' ],
		wpcom_name_servers: [ 'ns1.wordpress.com', 'ns2.wordpress.com', 'ns3.wordpress.com' ],
	},
};
