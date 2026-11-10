package org.mahavirtrust.backend.security;

import org.mahavirtrust.backend.entity.PortalRoleName;
import org.mahavirtrust.backend.entity.PortalUser;
import org.mahavirtrust.backend.entity.PortalUserRole;
import org.mahavirtrust.backend.repository.PortalUserRepository;
import org.mahavirtrust.backend.repository.PortalUserRoleRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class PortalUserDetailsService {

    private final PortalUserRepository portalUserRepository;
    private final PortalUserRoleRepository portalUserRoleRepository;

    public PortalUserDetailsService(
            PortalUserRepository portalUserRepository,
            PortalUserRoleRepository portalUserRoleRepository) {
        this.portalUserRepository = portalUserRepository;
        this.portalUserRoleRepository = portalUserRoleRepository;
    }

    public PortalPrincipal loadPortalUserByUuid(String userUuid) {
        PortalUser user = portalUserRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new UsernameNotFoundException("Portal user not found"));

        List<PortalUserRole> assignedRoles = portalUserRoleRepository.findByPortalUserId(user.getId());
        List<SimpleGrantedAuthority> authorities = assignedRoles.isEmpty()
                ? List.of(new SimpleGrantedAuthority(PortalRoleName.ROLE_GENERAL_USER.name()))
                : assignedRoles.stream()
                        .map(r -> new SimpleGrantedAuthority(r.getRoleName().name()))
                        .toList();

        return new PortalPrincipal(user.getId(), user.getUserUuid(), "ACTIVE".equals(user.getStatus()), authorities);
    }

    public static class PortalPrincipal implements UserDetails {
        private final Long id;
        private final String userUuid;
        private final boolean active;
        private final Collection<? extends GrantedAuthority> authorities;

        public PortalPrincipal(Long id, String userUuid, boolean active, Collection<? extends GrantedAuthority> authorities) {
            this.id = id;
            this.userUuid = userUuid;
            this.active = active;
            this.authorities = authorities;
        }

        public Long getId() { return id; }
        public String getUserUuid() { return userUuid; }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

        @Override
        public String getPassword() { return ""; }

        @Override
        public String getUsername() { return userUuid; }

        @Override
        public boolean isAccountNonExpired() { return true; }

        @Override
        public boolean isAccountNonLocked() { return active; }

        @Override
        public boolean isCredentialsNonExpired() { return true; }

        @Override
        public boolean isEnabled() { return active; }
    }
}

