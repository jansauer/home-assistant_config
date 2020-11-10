"""Describe group states."""


from homeassistant.components.group import GroupIntegrationRegistry
from homeassistant.const import STATE_OK, STATE_PROBLEM
from homeassistant.core import callback
from homeassistant.helpers.typing import HomeAssistantType


@callback
def async_describe_on_off_states(
    hass: HomeAssistantType, registry: GroupIntegrationRegistry
) -> None:
    """Describe group on off states."""
    registry.on_off_states({STATE_PROBLEM}, STATE_OK)
