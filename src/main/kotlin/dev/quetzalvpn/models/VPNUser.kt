package dev.quetzalvpn.models

import org.jetbrains.exposed.dao.Entity
import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

class VPNUser(id: EntityID<Int>): Entity<Int>(id) {
    companion object : EntityClass<Int, VPNUser>(VPNUsers)

    var name by VPNUsers.name
    var isEnabled by VPNUsers.isEnabled
    var createdBy by LoginUser referencedOn VPNUsers.createdByLoginUserId


}

object VPNUsers : IntIdTable(){
    val name = varchar("name", 100).uniqueIndex()
    val isEnabled = bool("isEnabled").default(true)
    val createdByLoginUserId = reference("createdByLoginUserId", LoginUsers)
}
