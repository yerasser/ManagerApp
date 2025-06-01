def get_services_list(device) -> list[dict]:
    if not device:
        return []

    services = []
    if device.verification != 0:
        services.append({"name": "verification", "price": device.verification})
    if device.calibration != 0:
        services.append({"name": "calibration", "price": device.calibration})
    if device.certification != 0:
        services.append({"name": "certification", "price": device.certification})

    return services
