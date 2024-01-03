const hideout_upgrades = [
    // Empty
    /*
    {
        id: 'unset',
        name: 'unset',
        materials: {},
        hideout_requirements: [],
        trader_requirements: {},
    },
    */
    // Air Filtering Unit
    {
        id: 'air_filtering_unit1',
        name: 'Air Filtering Unit LV1',
        materials: {
            'gas_mask_air_filter': 5,
            'dollars': 25000,
            'military_power_filter': 5,
            'military_corrugated_tube': 3
        },
        /* Have not concepted out the hideout/trader requirements
        either way could be a potential option depending on
        future upgrades */
        hideout_requirements: [
            'generator3',
            'vents3'
        ],
        trader_requirements: {
            'skier': 3
        }
    },
    // Bitcoin Farm
    {
        id: 'bitcoin_farm1',
        name: 'Bitcoin Farm LV1',
        materials: {
            't_shaped_plug': 5,
            'vpx_flash_storage_module': 1,
            'power_cord': 10,
            'power_supply_unit': 10,
            'cpu_fan': 15
        },
        hideout_requirements: [
            'intelligence_center2'
        ],
        trader_requirements: {},
    },
    {
        id: 'bitcoin_farm2',
        name: 'Bitcoin Farm LV2',
        materials: {
            'cpu_fan': 15,
            'power_supply_unit': 10,
            'printed_circuit_board': 15,
            'phase_control_relay': 5,
            'military_power_filter': 2,

        },
        hideout_requirements: [
            'generator3'
        ],
        trader_requirements: {},
    },
    {
        id: 'bitcoin_farm3',
        name: 'Bitcoin Farm LV3',
        materials: {
            'cpu_fan': 25,
            'silicone_tube': 15,
            'electric_motor': 10,
            'pressure_gauge': 10,
            '6_sten_140_m_military_battery': 1,
        },
        hideout_requirements: [
            'solar_power1',
            'water_collector3'
        ],
        trader_requirements: {},
    },
    // Workbench
    {
        id: 'workbench1',
        name: 'Workbench LV1',
        materials: {
            'screw_nuts': 2,
            'bolts': 2,
            'leatherman_multitool': 1
        }
    },
    {
        id: 'workbench2',
        name: 'Workbench LV2',
        materials: {
            'bolts': 6,
            'toolset': 3,
            'set_of_files_master': 1,
            'electric_drill': 2,
            'weapon_parts': 3
        },
        hideout_requirements: [
            'illumination2'
        ],
        trader_requirements: {
            'mechanic': 2,
        }
    },
    {
        id: 'workbench3',
        name: 'Workbench LV3',
        materials: {
            'roubles': 395000,
            'elite_pliers': 2,
            'fireklean_gun_lube': 1,
            'can_of_thermite': 2,
        },
        hideout_requirements: [
            'generator2',
            'stash2'
        ],
        trader_requirements: {
            'mechanic': 3,
        }
    }

]