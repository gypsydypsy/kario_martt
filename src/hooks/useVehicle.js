
import { useAfterPhysicsStep, useRapier } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const up = new THREE.Vector3(0, 1, 0)
const _wheelSteeringQuat = new THREE.Quaternion()
const _wheelRotationQuat = new THREE.Quaternion()

export const useVehicle = (
    chassisRef,
    wheelsRef,
    wheelsConfig,
) => {
    const { world } = useRapier()

    const vehicleController = useRef(null)

    useEffect(() => {
        const { current: chassis } = chassisRef
        const { current: wheels } = wheelsRef

        if (!chassis || !wheels) return

        const vehicle = world.createVehicleController(chassis)

        const suspensionDirection = new THREE.Vector3(0, -1, 0)

        wheelsConfig.forEach((wheel) => {
            vehicle.addWheel(wheel.position, suspensionDirection, wheel.axleCs, wheel.suspensionRestLength, wheel.radius)
        })

        wheelsConfig.forEach((wheel, index) => {
            vehicle.setWheelSuspensionStiffness(index, wheel.suspensionStiffness)
            vehicle.setWheelMaxSuspensionTravel(index, wheel.maxSuspensionTravel)
        })

        vehicleController.current = vehicle

        return () => {
            vehicleController.current = null
            world.removeVehicleController(vehicle)
        }
    }, [])

    useAfterPhysicsStep((world) => {
        if (!vehicleController.current) return

        const controller = vehicleController.current

        controller.updateVehicle(world.timestep)

        const { current: wheels } = wheelsRef

        wheels?.forEach((wheel, index) => {
            const wheelAxleCs = controller.wheelAxleCs(index)
            const connection = controller.wheelChassisConnectionPointCs(index)?.y || 0
            const suspension = controller.wheelSuspensionLength(index) || 0
            const steering = controller.wheelSteering(index) || 0
            const rotationRad = controller.wheelRotation(index) || 0

            wheel.position.y = connection - suspension

            _wheelSteeringQuat.setFromAxisAngle(up, steering)
            _wheelRotationQuat.setFromAxisAngle(wheelAxleCs, rotationRad)

            wheel.quaternion.multiplyQuaternions(_wheelSteeringQuat, _wheelRotationQuat)
        })
    })

    return {
        vehicleController,
    }
}